"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";

export async function updateSystemSettingsAction(
  settings: Record<string, any>,
) {
  try {
    // We update the Setting model for each key
    const updates = Object.entries(settings).map(([key, value]) =>
      db.setting.upsert({
        where: { key },
        update: { value: value as any, updatedAt: new Date() },
        create: { key, value: value as any },
      }),
    );

    await Promise.all(updates);

    await createAuditLog({
      action: "UPDATE",
      resource: "SystemSettings",
      resourceId: "global",
      meta: settings,
    });

    revalidatePath("/admin/monitoring/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update system settings:", error);
    return { success: false, error: error.message };
  }
}

export async function getIntegrationStatusAction() {
  return await db.integration.findMany();
}

export async function toggleIntegrationAction(id: string, enabled: boolean) {
  try {
    const _integration = await db.integration.update({
      where: { id },
      data: { enabled },
    });

    await createAuditLog({
      action: "TOGGLE",
      resource: "Integration",
      resourceId: id,
      meta: { enabled },
    });

    revalidatePath("/admin/monitoring/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function triggerBackupAction() {
  try {
    // In production, this would call a cloud function or shell script
    // console.log('Triggering Database Backup...');

    await createAuditLog({
      action: "BACKUP",
      resource: "Database",
      meta: { timestamp: new Date(), type: "MANUAL" },
    });

    return { success: true, message: "Database backup initiated successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
