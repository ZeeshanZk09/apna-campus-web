import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notification = await db.notification.update({
      where: {
        id,
        userId: user.id,
      },
      data: { read: true },
    });

    return NextResponse.json({ success: true, data: notification });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.notification.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 },
    );
  }
}
