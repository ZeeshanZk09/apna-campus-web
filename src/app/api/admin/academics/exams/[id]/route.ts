import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF", "TEACHER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const exam = await db.exam.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, code: true, title: true } },
        results: {
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
              },
            },
          },
          orderBy: { marks: "desc" },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: exam });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch exam details" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF", "TEACHER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const exam = await db.exam.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.type && { type: body.type }),
        ...(body.maxMarks !== undefined && { maxMarks: body.maxMarks }),
        ...(body.passingMarks !== undefined && {
          passingMarks: body.passingMarks,
        }),
        ...(body.date && { date: new Date(body.date) }),
      },
    });

    return NextResponse.json({ success: true, data: exam });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update exam" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    // Delete results first
    await db.examResult.deleteMany({ where: { examId: id } });
    await db.exam.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Exam deleted" });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete exam" },
      { status: 500 },
    );
  }
}
