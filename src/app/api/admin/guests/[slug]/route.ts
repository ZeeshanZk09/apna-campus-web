import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const guest = await db.user.findFirst({
      where: { id: slug, role: "GUEST", isDeleted: false },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        gender: true,
        profilePic: true,
        isBlocked: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: guest });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch guest" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    await db.user.update({ where: { id: slug }, data: { isDeleted: true } });
    return NextResponse.json({ success: true, message: "Guest deleted" });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete guest" },
      { status: 500 },
    );
  }
}
