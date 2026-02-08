import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";
import { attendanceSchema } from "@/lib/validators/academicValidator";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF", "TEACHER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cohortId = searchParams.get("cohortId") || "";
    const date = searchParams.get("date") || "";
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") || "50")),
    );

    const where: Record<string, unknown> = {};
    if (cohortId) {
      where.enrollment = { cohortId };
    }
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.date = { gte: startOfDay, lte: endOfDay };
    }

    const [records, total] = await Promise.all([
      db.attendance.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          enrollment: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profilePic: true,
                },
              },
              cohort: { select: { id: true, name: true } },
            },
          },
        },
      }),
      db.attendance.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: records,
      metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF", "TEACHER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = attendanceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message },
        { status: 400 },
      );
    }

    const { enrollmentId, date, status, note } = result.data;

    // Check if attendance already exists for this enrollment and date
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await db.attendance.findFirst({
      where: {
        enrollmentId,
        date: { gte: startOfDay, lte: endOfDay },
      },
    });

    if (existing) {
      // Update existing record
      const updated = await db.attendance.update({
        where: { id: existing.id },
        data: { status, note },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const record = await db.attendance.create({
      data: {
        enrollmentId,
        date: dateObj,
        status,
        note,
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to save attendance" },
      { status: 500 },
    );
  }
}
