// src/lib/queries/dashboardQueries.ts
import db from "@/lib/prisma";

export async function getAdminStats() {
  const [
    studentCount,
    teacherCount,
    courseCount,
    activeCohorts,
    pendingInvoices,
    totalRevenue,
    recentAuditLogs,
  ] = await Promise.all([
    db.user.count({ where: { role: "STUDENT", isDeleted: false } }),
    db.user.count({ where: { role: "TEACHER", isDeleted: false } }),
    db.course.count(),
    db.cohort.count({ where: { endDate: { gte: new Date() } } }),
    db.invoice.count({ where: { status: "PENDING" } }),
    db.payment.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    }),
    db.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { username: true } },
      },
    }),
  ]);

  return {
    studentCount,
    teacherCount,
    courseCount,
    activeCohorts,
    pendingInvoices,
    totalRevenue: totalRevenue._sum.amount || 0,
    recentAuditLogs: recentAuditLogs.map((log) => ({
      ...log,
      createdAt: log.createdAt.toISOString(),
    })),
  };
}

export async function getAttendanceReport(cohortId: string) {
  return await db.attendance.groupBy({
    by: ["status"],
    where: {
      enrollment: { cohortId },
    },
    _count: true,
  });
}

export async function getFinancialSummary() {
  const monthlyRevenue = await db.payment.groupBy({
    by: ["createdAt"],
    _sum: { amount: true },
    where: { status: "PAID" },
    orderBy: { createdAt: "asc" },
  });

  return monthlyRevenue;
}

export async function getRecentActivities() {
  return await db.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true, profilePic: true } },
    },
  });
}
