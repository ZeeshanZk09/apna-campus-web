import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";

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
      role: "GUEST" as const,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { username: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [guests, total] = await Promise.all([
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
        },
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: guests,
      metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch guests" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Guest ID is required" },
        { status: 400 },
      );
    }

    await db.user.update({ where: { id }, data: { isDeleted: true } });
    return NextResponse.json({ success: true, message: "Guest deleted" });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete guest" },
      { status: 500 },
    );
  }
}
