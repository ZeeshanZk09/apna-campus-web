import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import generateToken from "@/lib/auth/generateToken";
import db from "@/lib/prisma";
import { getExistingUser } from "@/lib/services/auth/userServices";
import { checkRateLimit, getRateLimitKey } from "@/lib/utils/rateLimit";
import { sanitizeText } from "@/lib/utils/sanitize";
import { registerSchema } from "@/lib/validators/authValidator";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimitKey = getRateLimitKey(ip, "register");
    const rateLimitResult = checkRateLimit(rateLimitKey, {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000,
    });
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Try again later.` },
        { status: 429 },
      );
    }

    const formData = await req.formData();

    const rawData = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    };

    // Validate input
    const validation = registerSchema.safeParse(rawData);
    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { username, email, password, name: rawName } = validation.data;
    const name = sanitizeText(rawName);

    // This throws if user already exists
    await getExistingUser({ username, email, term: "register" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: "STUDENT", // Default to student during public registration
      },
    });

    const { accessToken, refreshToken } = await generateToken(user.id, {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
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

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Registration error:", message);
    const isUserError =
      message.includes("already exists") || message.includes("Provide either");
    return NextResponse.json(
      { error: message },
      { status: isUserError ? 400 : 500 },
    );
  }
}
