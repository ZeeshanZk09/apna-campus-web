// src/lib/queries/auditQueries.ts
import db from "@/lib/prisma";

export async function createAuditLog(data: {
  userId?: string;
  adminId?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  meta?: any;
  ip?: string;
}) {
  return await db.auditLog.create({
    data: {
      userId: data.userId,
      adminId: data.adminId,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      meta: data.meta,
      ip: data.ip,
    },
  });
}

export async function getAuditLogs(params: {
  userId?: string;
  resource?: string;
  limit?: number;
}) {
  return await db.auditLog.findMany({
    where: {
      userId: params.userId,
      resource: params.resource,
    },
    take: params.limit || 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true, email: true } },
      admin: { select: { firstName: true } },
    },
  });
}

export async function getAllAuditLogs(limit = 100) {
  return await db.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true, email: true, role: true } },
    },
  });
}
