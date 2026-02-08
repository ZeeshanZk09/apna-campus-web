import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { userSchema } from "@/lib/validators/userValidator";

export async function GET() {
  try {
    const users = await db.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        gender: true,
        isBlocked: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ success: true, data: users });
  } catch (_error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = userSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.format() },
        { status: 400 },
      );
    }

    const { name, username, email, password, role } = result.data;

    // Check if user exists
    const existing = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
        name,
      },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (_error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
