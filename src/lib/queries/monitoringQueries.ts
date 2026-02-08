import db from "@/lib/prisma";

export async function getMonitoringStats() {
  const [totalLogs, securityEvents, recentLogs] = await Promise.all([
    db.auditLog.count(),
    db.auditLog.count({
      where: {
        action: {
          in: ["ACCESS_DENIED", "DELETE", "DISABLE_2FA"],
        },
      },
    }),
    db.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, role: true },
        },
      },
    }),
  ]);

  return {
    totalLogs,
    securityEvents,
    recentLogs,
  };
}

export async function getHealthStatus() {
  // Mocking system health checks
  return {
    database: "CONNECTED",
    storage: "HEALTHY",
    cache: "ACTIVE",
    uptime: "14 days, 3 hours",
  };
}
