import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";

/**
 * Teacher dashboard data API
 * Returns cohorts, student count, assignments, upcoming exams
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [teacherCohorts, recentSubmissions, upcomingExams] =
      await Promise.all([
        // Teacher's cohorts with enrollment counts
        db.teacherCohort.findMany({
          where: { teacherId: user.id },
          include: {
            cohort: {
              include: {
                program: { select: { name: true } },
                _count: { select: { enrollments: true } },
              },
            },
          },
        }),

        // Recent submissions to grade
        db.submission.findMany({
          where: {
            assignment: {
              course: {
                subjects: {
                  some: {
                    lessons: { some: {} },
                  },
                },
              },
            },
          },
          include: {
            student: { select: { id: true, name: true, username: true } },
            assignment: {
              select: {
                id: true,
                title: true,
                course: { select: { title: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),

        // Upcoming exams
        db.exam.findMany({
          where: { date: { gte: new Date() } },
          include: { course: { select: { title: true, code: true } } },
          orderBy: { date: "asc" },
          take: 5,
        }),
      ]);

    const totalStudents = teacherCohorts.reduce(
      (sum, tc) => sum + (tc.cohort._count?.enrollments || 0),
      0,
    );

    return NextResponse.json({
      success: true,
      data: {
        cohorts: teacherCohorts.map((tc) => ({
          ...tc.cohort,
          role: tc.role,
        })),
        totalStudents,
        recentSubmissions,
        upcomingExams,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch teacher data" },
      { status: 500 },
    );
  }
}
