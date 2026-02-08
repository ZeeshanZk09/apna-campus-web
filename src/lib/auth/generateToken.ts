import type { JWTPayload } from "jose";
import { getIpAddress } from "@/lib/auth/authHelpers";
import { createAccessToken, createRefreshToken } from "@/lib/auth/token";
import db from "@/lib/prisma";

/**
 * Generates access and refresh tokens for a user, and creates a DB session.
 * Throws on failure — callers in API routes handle HTTP responses.
 */
export default async function generateToken(
  id: string,
  payload: JWTPayload,
): Promise<{ accessToken: string; refreshToken: string }> {
  if (!id) {
    throw new Error("User ID is required for token generation.");
  }

  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found.");
  }

  const accessToken = await createAccessToken(payload);
  const refreshToken = await createRefreshToken(payload);
  const ip = await getIpAddress();

  await db.session.create({
    data: {
      refreshToken,
      ip: ip ?? "unknown",
      user: { connect: { id: user.id } },
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}
