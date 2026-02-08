'use server';

import { cookies, headers } from 'next/headers';
import type { User } from '@/app/generated/prisma/client';
import db from '@/lib/prisma';
import { verifyAccessToken } from './token';

export async function isJwtExpired(err: unknown): Promise<boolean> {
  const e = err as Record<string, unknown>;
  return Boolean(e && (e.code === 'ERR_JWT_EXPIRED' || /expired/i.test(String(e.message || e))));
}

export async function isSignatureError(err: unknown): Promise<boolean> {
  const e = err as Record<string, unknown>;
  return Boolean(
    e &&
    (e.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' ||
      /signature verification failed/i.test(String(e.message || e)) ||
      /invalid signature/i.test(String(e.message || e)))
  );
}

/** Read client IP from headers (works behind proxies/load balancers) */
export async function getIpAddress(): Promise<string | undefined> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim();
  return h.get('x-real-ip') ?? undefined;
}

export async function getSessionUser(): Promise<Pick<
  User,
  'id' | 'username' | 'email' | 'role' | 'profilePic' | 'twoFactorEnabled'
> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  if (!token) return null;

  try {
    const { payload } = await verifyAccessToken(token);
    if (!payload || !payload.id) return null;
    return await db.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profilePic: true,
        twoFactorEnabled: true,
      },
    });
  } catch (_error) {
    return null;
  }
}
