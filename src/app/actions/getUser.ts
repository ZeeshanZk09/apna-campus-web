'use server';

import { cookies, headers } from 'next/headers';
import db from '@/lib/prisma';
import { decodeProtectedHeader } from 'jose';
import type { User } from '@/app/generated/prisma/client';
import { createAccessToken, verifyAccessToken, verifyRefreshToken } from '@/utils/token';
import { JwtPayload } from 'jsonwebtoken';

type FetchUserResult = { user: User | null; loading?: boolean; newAccessToken?: string };

type VerifyTokenResult = {
  payload: JwtPayload;
  error: unknown;
  valid: boolean;
};

function isJwtExpired(err: unknown) {
  const e = err as any;
  return Boolean(e && (e.code === 'ERR_JWT_EXPIRED' || /expired/i.test(String(e.message || e))));
}

function isSignatureError(err: unknown) {
  const e = err as any;
  return Boolean(
    e &&
      (e.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' ||
        /signature verification failed/i.test(String(e.message || e)) ||
        /invalid signature/i.test(String(e.message || e)))
  );
}

/** Read client IP from headers (works behind proxies/load balancers) */
async function getIpAddress(): Promise<string | undefined> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim();
  return h.get('x-real-ip') ?? undefined;
}

/**
 * fetchUser:
 * - Verifies access token from cookie 'token'
 * - If the access token is expired -> tries refresh token (cookie 'refreshToken')
 * - If refresh valid and session exists -> issues a new access token and returns it
 * - Also tries to detect if a refresh token was stored in the `token` cookie
 */
async function fetchUser(): Promise<FetchUserResult> {
  try {
    const cookieStore = await cookies();
    const accessCookie = cookieStore.get('token');
    if (!accessCookie) {
      console.warn('No access token found in cookies');
      return { user: null, loading: false };
    }

    const accessValue = accessCookie.value;

    // Peek header for debug logs
    let header: Record<string, unknown> | undefined;
    try {
      header = decodeProtectedHeader(accessValue);
    } catch (e) {
      console.warn('Failed to decode token header', { error: String(e) });
      return { user: null, loading: false };
    }

    // 1) Try verifying as an ACCESS token
    const accessResult = (await verifyAccessToken(accessValue)) as VerifyTokenResult;
    if (accessResult.valid) {
      const userId: string = accessResult.payload.id as string;
      if (!userId) {
        console.warn('No userId in access token payload', { payload: accessResult.payload });
        return { user: null, loading: false };
      }
      const user = await db.user.findUnique({ where: { id: String(userId) } });
      if (!user) {
        console.warn('User not found for ID', { userId });
      }
      return { user: user ?? null, loading: false };
    }

    // Handle verification failure
    const verifyErr = accessResult.error;
    const errMsg = verifyErr instanceof Error ? verifyErr.message : String(verifyErr);
    const errCode = (verifyErr as any)?.code ?? (verifyErr as any)?.name ?? 'Unknown';
    console.warn('Access token verification failed', { errCode, errMsg, header });

    const expired = isJwtExpired(verifyErr);
    const sigFail = isSignatureError(verifyErr);

    // 2) If signature failure, check if token is a refresh token
    if (sigFail) {
      const refreshAsAccessResult = (await verifyRefreshToken(accessValue)) as VerifyTokenResult;
      if (refreshAsAccessResult.valid) {
        const userId = refreshAsAccessResult.payload.id as string;
        if (!userId) {
          console.warn('No userId in refresh token payload', {
            payload: refreshAsAccessResult.payload,
          });
          return { user: null, loading: false };
        }

        // Verify session exists
        const session = await db.session.findFirst({ where: { refreshToken: accessValue } });
        if (!session) {
          console.warn('Refresh token verified but session not found in DB', { userId });
          return { user: null, loading: false };
        }

        // Issue new access token
        const newAccessToken = await createAccessToken(refreshAsAccessResult.payload);
        const user = await db.user.findUnique({ where: { id: String(userId) } });
        if (!user) {
          console.warn('User not found for ID', { userId });
        }
        return { user: user ?? null, loading: false, newAccessToken };
      }

      console.error('Token failed verification with both access and refresh keys', {
        error: refreshAsAccessResult.error,
      });
      // Clear invalid token cookie
      cookieStore.delete('token');
      return { user: null, loading: false };
    }

    // 3) If token expired, try refresh flow
    if (expired) {
      const refreshCookie = cookieStore.get('refreshToken');
      if (!refreshCookie) {
        console.warn('No refresh token found in cookies');
        return { user: null, loading: false };
      }

      const refreshValue = refreshCookie.value;
      const refreshResult = (await verifyRefreshToken(refreshValue)) as VerifyTokenResult;
      if (refreshResult.valid) {
        const userId = refreshResult.payload.id as string;
        if (!userId) {
          console.warn('No userId in refresh token payload', { payload: refreshResult.payload });
          return { user: null, loading: false };
        }

        // Verify session exists
        const session = await db.session.findFirst({ where: { refreshToken: refreshValue } });
        if (!session) {
          console.warn('Refresh token not found in DB session store', { userId });
          return { user: null, loading: false };
        }

        // Issue new access token
        const newAccessToken = await createAccessToken(refreshResult.payload);
        const user = await db.user.findUnique({ where: { id: String(userId) } });
        if (!user) {
          console.warn('User not found for ID', { userId });
        }
        return { user: user ?? null, loading: false, newAccessToken };
      }

      console.error('Refresh token verification failed', { error: refreshResult.error });
      // Clear invalid refresh token cookie
      cookieStore.delete('refreshToken');
      return { user: null, loading: false };
    }

    // Unknown verification failure
    console.error('Unknown access token verification failure', { errCode, errMsg });
    cookieStore.delete('token');
    return { user: null, loading: false };
  } catch (error) {
    console.error('Failed to fetch user', { error: String(error) });
    return { user: null, loading: false };
  }
}

export { fetchUser, getIpAddress };
export type { FetchUserResult };
