import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { verify2FAToken } from "@/lib/auth/2fa";
import generateToken from "@/lib/auth/generateToken";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: "User ID and TOTP code are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profilePic: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
      },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "2FA not enabled for this user" },
        { status: 400 },
      );
    }

    const isValid = verify2FAToken(code, user.twoFactorSecret);

    if (!isValid) {
      await createAuditLog({
        userId: user.id,
        action: "LOGIN_FAILURE_2FA",
        resource: "AUTH",
        resourceId: user.id,
        meta: { reason: "Invalid TOTP code" },
      });
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 401 },
      );
    }

    // Success - generate tokens
    const { accessToken, refreshToken } = await generateToken(user.id, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const cookieStore = await cookies();

    // Set Access Token Cookie
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Set Refresh Token Cookie
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    await createAuditLog({
      userId: user.id,
      action: "LOGIN_SUCCESS_2FA",
      resource: "AUTH",
      resourceId: user.id,
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("2FA Verification Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
