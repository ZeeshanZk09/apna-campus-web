import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";
import { examSchema } from "@/lib/validators/assessmentValidator";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF", "TEACHER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId") || "";
    const type = searchParams.get("type") || "";
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") || "20")),
    );

    const where: Record<string, unknown> = {};
    if (courseId) where.courseId = courseId;
    if (type) where.type = type;

    const [exams, total] = await Promise.all([
      db.exam.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
        include: {
          course: { select: { id: true, code: true, title: true } },
          _count: { select: { results: true } },
        },
      }),
      db.exam.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: exams,
      metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch exams" },
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
    const result = examSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message },
        { status: 400 },
      );
    }

    const { courseId, title, type, maxMarks, passingMarks, date } = result.data;

    const exam = await db.exam.create({
      data: {
        courseId,
        title,
        type,
        maxMarks,
        passingMarks,
        date: date ? new Date(date) : null,
      },
      include: {
        course: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json({ success: true, data: exam }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create exam" },
      { status: 500 },
    );
  }
}
