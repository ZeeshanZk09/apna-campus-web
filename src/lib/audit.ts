import { getSessionUser } from "@/lib/auth/authHelpers";
import db from "@/lib/prisma";

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "ENABLE_2FA"
  | "DISABLE_2FA"
  | "PASSWORD_CHANGE"
  | "ACCESS_DENIED";

interface AuditLogOptions {
  action: AuditAction | string;
  resource: string;
  resourceId?: string;
  userId?: string;
  adminId?: string;
  meta?: any;
  ip?: string;
  status?: string;
}

export async function createAuditLog(options: AuditLogOptions) {
  try {
    const { action, resource, resourceId, userId, adminId, meta, ip } = options;

    let finalUserId = userId;
    const finalAdminId = adminId;

    // If userId not provided, try to get from session
    if (!finalUserId && !finalAdminId) {
      const user = await getSessionUser();
      if (user) {
        // Simple logic to distinguish: if user is in user table but has ADMIN role
        // In this schema, we have separate User and Admin models it seems
        finalUserId = user.id;
      }
    }

    await db.auditLog.create({
      data: {
        action,
        resource,
        resourceId,
        userId: finalUserId,
        adminId: finalAdminId,
        meta: meta || {},
        ip: ip || null,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}
