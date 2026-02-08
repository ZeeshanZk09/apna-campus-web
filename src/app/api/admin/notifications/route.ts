import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";
import { notificationSchema } from "@/lib/validators/communicationValidator";

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

    const [notifications, total] = await Promise.all([
      db.notification.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, username: true } },
        },
      }),
      db.notification.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
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
    const result = notificationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message },
        { status: 400 },
      );
    }

    const { title, body: message, userId, role: targetRole } = result.data;

    // If a specific user is targeted
    if (userId) {
      const notification = await db.notification.create({
        data: { title, body: message, userId },
      });
      return NextResponse.json(
        { success: true, data: notification },
        { status: 201 },
      );
    }

    // Broadcast to all users of a specific role
    if (targetRole) {
      const users = await db.user.findMany({
        where: { role: targetRole as never, isDeleted: false },
        select: { id: true },
      });

      const notifications = await db.notification.createMany({
        data: users.map((u) => ({
          title,
          body: message,
          userId: u.id,
        })),
      });

      return NextResponse.json(
        { success: true, data: { count: notifications.count } },
        { status: 201 },
      );
    }

    // Broadcast to all users
    const allUsers = await db.user.findMany({
      where: { isDeleted: false },
      select: { id: true },
    });

    const notifications = await db.notification.createMany({
      data: allUsers.map((u) => ({
        title,
        body: message,
        userId: u.id,
      })),
    });

    return NextResponse.json(
      { success: true, data: { count: notifications.count } },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}
