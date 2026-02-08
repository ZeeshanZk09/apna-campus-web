import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";

/**
 * Student dashboard data API
 * Returns enrollments, attendance summary, recent grades, upcoming exams
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      enrollments,
      attendanceSummary,
      recentResults,
      upcomingExams,
      invoices,
    ] = await Promise.all([
      // Enrollments with cohort info
      db.enrollment.findMany({
        where: { userId: user.id },
        include: {
          cohort: {
            include: {
              program: { select: { name: true, code: true } },
              _count: { select: { enrollments: true } },
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      }),

      // Attendance summary
      db.attendance.groupBy({
        by: ["status"],
        where: { enrollment: { userId: user.id } },
        _count: { status: true },
      }),

      // Recent exam results
      db.examResult.findMany({
        where: { enrollment: { userId: user.id } },
        include: {
          exam: {
            select: {
              title: true,
              type: true,
              maxMarks: true,
              date: true,
              course: { select: { title: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      // Upcoming exams
      db.exam.findMany({
        where: {
          date: { gte: new Date() },
          course: {
            assignments: {
              some: { submissions: { some: { studentId: user.id } } },
            },
          },
        },
        include: { course: { select: { title: true, code: true } } },
        orderBy: { date: "asc" },
        take: 5,
      }),

      // Pending invoices
      db.invoice.findMany({
        where: { enrollment: { userId: user.id }, status: "PENDING" },
        include: { fee: { select: { title: true, type: true } } },
        orderBy: { issuedAt: "desc" },
      }),
    ]);

    // Format attendance stats
    const attendanceStats = {
      total: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };
    for (const item of attendanceSummary) {
      const count = item._count.status;
      attendanceStats.total += count;
      switch (item.status) {
        case "PRESENT":
          attendanceStats.present = count;
          break;
        case "ABSENT":
          attendanceStats.absent = count;
          break;
        case "LATE":
          attendanceStats.late = count;
          break;
        case "EXCUSED":
          attendanceStats.excused = count;
          break;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        enrollments,
        attendanceStats,
        recentResults,
        upcomingExams,
        pendingInvoices: invoices,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch student data" },
      { status: 500 },
    );
  }
}
