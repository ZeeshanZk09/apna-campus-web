import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/token";
import db from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { payload, valid } = await verifyAccessToken(token);

    if (!valid || !payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id as string;

    const user = await db.user.findUnique({
      where: { id: userId, isDeleted: false },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        profilePic: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
