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
      role: { in: ["PARENT" as const, "GUARDIAN" as const] },
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { username: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [parents, total] = await Promise.all([
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
          role: true,
          gender: true,
          profilePic: true,
          isBlocked: true,
          createdAt: true,
          parentChildren: {
            select: {
              child: { select: { id: true, name: true, username: true } },
              relation: true,
            },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: parents,
      metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch parents/guardians" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { childId, relation, ...userData } = body;
    const result = userSchema.safeParse(userData);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message },
        { status: 400 },
      );
    }

    const { name, username, email, password } = result.data;
    const role = body.role === "GUARDIAN" ? "GUARDIAN" : "PARENT";

    const existing = await db.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const parent = await db.user.create({
      data: { name, username, email, password: hashedPassword, role },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Link to child if provided
    if (childId) {
      await db.parentChild.create({
        data: { parentId: parent.id, childId, relation: relation || null },
      });
    }

    return NextResponse.json({ success: true, data: parent }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create parent/guardian" },
      { status: 500 },
    );
  }
}
