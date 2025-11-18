// app/actions/generateToken.ts
import { NextResponse } from 'next/server';
import { ApiError } from '@/utils/NextApiError';
import { getPrisma } from '@/lib/prisma';
import { createAccessToken, createRefreshToken } from '@/utils/token';
import { JWTPayload } from 'jose';
import { getIpAddress } from '@/utils/auth/authHelpers';
const db = getPrisma();

export default async function generateToken(id: string, payload: JWTPayload) {
  try {
    if (!id) {
      return NextResponse.json(new ApiError(400, 'User ID is required.', {}, true));
    }

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json(new ApiError(404, 'User not found.', {}, true));
    }

    const accessToken = await createAccessToken(payload);

    const refreshToken = await createRefreshToken(payload);

    const ip = await getIpAddress();

    await db.session.create({
      data: {
        refreshToken,
        ip: ip ?? 'unknown',
        user: { connect: { id: user.id } },
        // optional: store expiresAt if your session model has it
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Return both tokens — caller can set cookies or return to client as needed.
    return accessToken;
  } catch (err) {
    console.error('Token generation failed:', err);
    return NextResponse.json(
      new ApiError(
        500,
        'Internal server error.',
        { message: err instanceof Error ? err.message : String(err) },
        true
      )
    );
  }
}
