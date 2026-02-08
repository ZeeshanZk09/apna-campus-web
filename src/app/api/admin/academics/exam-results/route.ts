import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";
import { examResultSchema } from "@/lib/validators/assessmentValidator";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF", "TEACHER"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = examResultSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message },
        { status: 400 },
      );
    }

    const { examId, enrollmentId, marks, grade, remarks } = result.data;

    // Upsert — update if exists, create if not
    const examResult = await db.examResult.upsert({
      where: { examId_enrollmentId: { examId, enrollmentId } },
      update: { marks, grade, remarks },
      create: { examId, enrollmentId, marks, grade, remarks },
      include: {
        enrollment: {
          include: {
            user: { select: { id: true, name: true, username: true } },
          },
        },
        exam: { select: { title: true } },
      },
    });

    return NextResponse.json(
      { success: true, data: examResult },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to record exam result" },
      { status: 500 },
    );
  }
}
