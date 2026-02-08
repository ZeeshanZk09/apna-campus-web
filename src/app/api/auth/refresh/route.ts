import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAccessToken, verifyRefreshToken } from "@/lib/auth/token";
import db from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token missing" },
      { status: 401 },
    );
  }

  const { payload, valid } = await verifyRefreshToken(refreshToken);

  if (!valid || !payload) {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 },
    );
  }

  // Check if session exists in DB
  const session = await db.session.findFirst({
    where: { refreshToken },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 401 });
  }

  // Generate new Access Token
  const newAccessToken = await createAccessToken({
    id: payload.id,
    username: payload.username,
    email: payload.email,
    role: payload.role,
  });

  // Set new Access Token cookie
  cookieStore.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return NextResponse.json({ success: true });
}
