import { JwtPayload } from 'jsonwebtoken';
import { headers } from 'next/headers';
type Term = 'register' | 'login';
import type { User } from '@/app/generated/prisma/client';

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

export { isJwtExpired, isSignatureError, getIpAddress };

export type { VerifyTokenResult, Term };
