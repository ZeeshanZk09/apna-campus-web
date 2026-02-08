// app/api/auth/login/route.ts

import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { User } from "@/app/generated/prisma/client";
import generateToken from "@/lib/auth/generateToken";
import { getExistingUser } from "@/lib/services/auth/userServices";
import { checkRateLimit, getRateLimitKey } from "@/lib/utils/rateLimit";
import { loginSchema } from "@/lib/validators/authValidator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const rateLimitKey = getRateLimitKey(ip, "login");
    const rateLimitResult = checkRateLimit(rateLimitKey, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Try again in ${Math.ceil((rateLimitResult.retryAfter ?? 0) / 1000)} seconds.`,
        },
        { status: 429 },
      );
    }

    const formData = await request.formData();

    const rawData = {
      identifier: (formData.get("username") ||
        formData.get("email") ||
        "") as string,
      password: formData.get("password") as string,
    };

    // Validate input
    const validation = loginSchema.safeParse(rawData);
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { identifier, password } = validation.data;
    const isEmail = identifier.includes("@");
    const username = isEmail ? "" : identifier;
    const email = isEmail ? identifier : "";

    const user = (await getExistingUser({
      username,
      email,
      term: "login",
    })) as User;

    // Verify password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Check for 2FA
    if (user.twoFactorEnabled) {
      return NextResponse.json(
        {
          success: true,
          twoFactorRequired: true,
          userId: user.id,
        },
        { status: 200 },
      );
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateToken(user.id, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profilePic: user.profilePic,
        },
      },
      {
        status: 200,
      },
    );

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

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Login error:", message);
    // Return user-friendly errors from our service layer, 500 for unknown
    const isUserError =
      message.includes("Invalid credentials") ||
      message.includes("Provide either");
    return NextResponse.json(
      { error: message },
      { status: isUserError ? 400 : 500 },
    );
  }
}
