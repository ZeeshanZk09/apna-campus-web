import { decodeJwt } from 'jose';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/api/NextApiError';
import { ApiSuccess } from '@/lib/api/NextApiSuccess';
import { isJwtExpired, isSignatureError } from '@/lib/auth/authHelpers';
import { createAccessToken, verifyAccessToken, verifyRefreshToken } from '@/lib/auth/token';
import { getPrisma } from '@/lib/prisma';

type JwtPayloadLike = Record<string, any>;

export async function GET(_req: NextRequest) {
  try {
    // ----- 1) Read access cookie -----
    const cookieStore = await cookies();
    const accessCookie = cookieStore.get('accessToken');
    if (!accessCookie) {
      return NextResponse.json(new ApiError(401, 'Unauthorized: no access token provided'), {
        status: 401,
      });
    }

    const accessToken = accessCookie.value;

    // ----- 2) Try verify access token -----
    const accessResult = await verifyAccessToken(accessToken);

    // Lazy get prisma only when needed (prevents import-time DB init)
    const db = getPrisma();

    if (accessResult.valid) {
      // Access token valid -> fetch user and return
      const userId = String((accessResult.payload as JwtPayloadLike).id ?? '');
      if (!userId) {
        // defensive: token did not contain id
        return NextResponse.json(new ApiError(401, 'Unauthorized: token payload missing id'), {
          status: 401,
        });
      }

      const user = await db.user.findUnique({
        where: { id: userId },
        // optionally exclude sensitive fields here
      });

      if (!user) {
        return NextResponse.json(new ApiError(404, 'User not found'), {
          status: 404,
        });
      }

      return NextResponse.json(new ApiSuccess(user, 200), { status: 200 });
    }

    // ----- 3) Verification failed -> inspect error -----
    const verifyErr = accessResult.error;
    const expired = await isJwtExpired(verifyErr);
    const sigFail = await isSignatureError(verifyErr);

    // If signature invalid -> token tampered -> clear cookie + 401
    if (sigFail) {
      const res = NextResponse.json(new ApiError(401, 'Unauthorized: invalid token'), {
        status: 401,
      });
      res.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
      res.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
      return res;
    }

    // ----- 4) If token expired -> attempt refresh via session table -----
    if (expired) {
      // decode token payload WITHOUT verifying to learn the user id
      let decoded: JwtPayloadLike | undefined;
      try {
        decoded = decodeJwt(accessToken) as JwtPayloadLike;
      } catch (_err) {
        const res = NextResponse.json(new ApiError(401, 'Unauthorized: invalid token payload'), {
          status: 401,
        });
        res.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
        res.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
        return res;
      }

      const userId = String(decoded?.id ?? decoded?.sub ?? '');
      if (!userId) {
        const res = NextResponse.json(
          new ApiError(401, 'Unauthorized: cannot determine user from expired token'),
          { status: 401 }
        );
        res.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
        res.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
        return res;
      }

      // find the most recent session for this user (server is single source for refresh tokens)
      const session = await db.session.findFirst({
        where: { userId },
      });

      if (!session) {
        const res = NextResponse.json(
          new ApiError(401, 'Unauthorized: no refresh session available'),
          { status: 401 }
        );
        res.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
        res.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
        return res;
      }

      const refreshValue = session.refreshToken;
      const refreshResult = await verifyRefreshToken(refreshValue);

      if (!refreshResult.valid) {
        // refresh invalid -> remove session and force re-login
        try {
          await db.session.delete({ where: { id: session.id } });
        } catch (e) {
          // ignore DB delete errors but warn
          console.warn('Failed to delete invalid session', {
            sessionId: session.id,
            err: String(e),
          });
        }

        const res = NextResponse.json(new ApiError(401, 'Unauthorized: refresh token invalid'), {
          status: 401,
        });
        res.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
        res.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
        return res;
      }

      // refresh is valid -> issue a new access token and return user
      const newAccessToken = await createAccessToken(refreshResult.payload as JwtPayloadLike);

      const user = await db.user.findUnique({ where: { id: userId } });
      if (!user) {
        const res = NextResponse.json(new ApiError(404, 'User not found'), {
          status: 404,
        });
        res.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
        res.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
        return res;
      }

      // Build response and set token cookie (maxAge in seconds)
      const fifteenMinutesInSeconds = 60 * 15;
      const response = NextResponse.json(new ApiSuccess(user, 200), {
        status: 200,
      });
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: fifteenMinutesInSeconds,
      });
      return response;
    }

    // ----- 5) Unknown verification error -> clear session & unauthorized -----
    // best effort: if we can get userId from cookie header or decode, attempt to remove session
    try {
      const maybeDecoded = decodeJwt(accessToken) as JwtPayloadLike;
      const maybeUserId = String(maybeDecoded?.id ?? maybeDecoded?.sub ?? '');
      if (maybeUserId) {
        // optionally delete server-side session(s) for safety
        await db.session.deleteMany({ where: { userId: maybeUserId } });
      }
    } catch (_e) {
      // ignore decode/delete errors
    }

    const res = NextResponse.json(new ApiError(401, 'Unauthorized: token verification failed'), {
      status: 401,
    });
    res.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
    res.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });
    return res;
  } catch (error) {
    console.error('Failed to fetch user:', String(error));
    return NextResponse.json(new ApiError(500, 'Failed to fetch user'), {
      status: 500,
    });
  }
}
