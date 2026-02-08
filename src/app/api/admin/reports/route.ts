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
    const type = searchParams.get("type") || "overview";

    switch (type) {
      case "overview": {
        const [
          totalUsers,
          totalStudents,
          totalTeachers,
          totalCourses,
          totalDepartments,
          totalPrograms,
          totalEnrollments,
          activeEnrollments,
          totalExams,
          totalAssignments,
          totalRevenue,
          pendingInvoices,
        ] = await Promise.all([
          db.user.count({ where: { isDeleted: false } }),
          db.user.count({ where: { isDeleted: false, role: "STUDENT" } }),
          db.user.count({ where: { isDeleted: false, role: "TEACHER" } }),
          db.course.count({ where: { deletedAt: null } }),
          db.department.count(),
          db.program.count({ where: { deletedAt: null } }),
          db.enrollment.count(),
          db.enrollment.count({ where: { status: "ACTIVE" } }),
          db.exam.count(),
          db.assignment.count(),
          db.payment.aggregate({
            _sum: { amount: true },
            where: { status: "PAID" },
          }),
          db.invoice.count({ where: { status: "PENDING" } }),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            users: {
              total: totalUsers,
              students: totalStudents,
              teachers: totalTeachers,
            },
            academics: {
              courses: totalCourses,
              departments: totalDepartments,
              programs: totalPrograms,
            },
            enrollments: { total: totalEnrollments, active: activeEnrollments },
            assessments: { exams: totalExams, assignments: totalAssignments },
            finance: {
              totalRevenue: totalRevenue._sum.amount || 0,
              pendingInvoices,
            },
          },
        });
      }

      case "enrollment-trends": {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const enrollments = await db.enrollment.findMany({
          where: { createdAt: { gte: sixMonthsAgo } },
          select: { createdAt: true, status: true },
          orderBy: { createdAt: "asc" },
        });

        // Group by month
        const monthlyData: Record<
          string,
          { total: number; active: number; withdrawn: number }
        > = {};
        for (const enrollment of enrollments) {
          const month = enrollment.createdAt.toISOString().slice(0, 7);
          if (!monthlyData[month]) {
            monthlyData[month] = { total: 0, active: 0, withdrawn: 0 };
          }
          monthlyData[month].total++;
          if (enrollment.status === "ACTIVE") monthlyData[month].active++;
          if (enrollment.status === "WITHDRAWN") monthlyData[month].withdrawn++;
        }

        return NextResponse.json({
          success: true,
          data: Object.entries(monthlyData).map(([month, data]) => ({
            month,
            ...data,
          })),
        });
      }

      case "attendance-summary": {
        const cohortId = searchParams.get("cohortId");
        const where: Record<string, unknown> = {};
        if (cohortId) {
          where.enrollment = { cohortId };
        }

        const [present, absent, late, excused] = await Promise.all([
          db.attendance.count({ where: { ...where, status: "PRESENT" } }),
          db.attendance.count({ where: { ...where, status: "ABSENT" } }),
          db.attendance.count({ where: { ...where, status: "LATE" } }),
          db.attendance.count({ where: { ...where, status: "EXCUSED" } }),
        ]);

        const total = present + absent + late + excused;
        return NextResponse.json({
          success: true,
          data: {
            total,
            present,
            absent,
            late,
            excused,
            presentRate: total ? ((present / total) * 100).toFixed(1) : "0",
          },
        });
      }

      case "finance-summary": {
        const [totalPaid, totalPending, totalRefunded, recentPayments] =
          await Promise.all([
            db.payment.aggregate({
              _sum: { amount: true },
              where: { status: "PAID" },
            }),
            db.invoice.aggregate({
              _sum: { amount: true },
              where: { status: "PENDING" },
            }),
            db.payment.aggregate({
              _sum: { amount: true },
              where: { status: "REFUNDED" },
            }),
            db.payment.findMany({
              where: { status: "PAID" },
              orderBy: { paidAt: "desc" },
              take: 10,
              include: {
                invoice: {
                  include: {
                    enrollment: {
                      include: {
                        user: { select: { name: true, username: true } },
                      },
                    },
                    fee: { select: { title: true } },
                  },
                },
              },
            }),
          ]);

        return NextResponse.json({
          success: true,
          data: {
            totalPaid: totalPaid._sum.amount || 0,
            totalPending: totalPending._sum.amount || 0,
            totalRefunded: totalRefunded._sum.amount || 0,
            recentPayments,
          },
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 },
        );
    }
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
