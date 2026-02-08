import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";
import { userSchema } from "@/lib/validators/userValidator";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") || "20")),
    );
    const search = searchParams.get("search") || "";

    const where = {
      isDeleted: false,
      role: "TEACHER" as const,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { username: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [teachers, total] = await Promise.all([
      db.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          gender: true,
          profilePic: true,
          isBlocked: true,
          createdAt: true,
          _count: { select: { teacherCohorts: true } },
        },
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: teachers,
      metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message },
        { status: 400 },
      );
    }

    const { name, username, email, password } = result.data;

    const existing = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = await db.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: "TEACHER",
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: teacher }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 },
    );
  }
}
