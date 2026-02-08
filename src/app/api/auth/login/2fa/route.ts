import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/api/NextApiError";
import { verify2FAToken } from "@/lib/auth/2fa";
import generateToken from "@/lib/auth/generateToken";
import db from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, token } = await req.json();

    if (!userId || !token) {
      return ApiError.badRequest(
        "User ID and verification token are required",
      ).toNextResponse();
    }

    const user = await db.user.findUnique({
      where: { id: userId, isDeleted: false },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return ApiError.badRequest(
        "2FA is not enabled for this user",
      ).toNextResponse();
    }

    const isValid = verify2FAToken(token, user.twoFactorSecret);

    if (!isValid) {
      return ApiError.unauthorized("Invalid 2FA token").toNextResponse();
    }

    // Generate full tokens
    const { accessToken, refreshToken } = (await generateToken(user.id, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    })) as { accessToken: string; refreshToken: string };

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    console.error("2FA Login Error:", error);
    return ApiError.internal("Internal server error").toNextResponse();
  }
}
