"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/prisma";

export async function sendNotificationAction(data: {
  userId?: string;
  adminId?: string;
  conversationId?: string;
  title: string;
  body: string;
  meta?: any;
}) {
  try {
    const notification = await db.notification.create({
      data: {
        userId: data.userId,
        adminId: data.adminId,
        conversationId: data.conversationId,
        title: data.title,
        body: data.body,
        meta: data.meta || {},
      },
    });

    if (data.userId) revalidatePath(`/user/notifications`);
    if (data.adminId) revalidatePath(`/admin/notifications`);

    return { success: true, notification };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markNotificationReadAction(id: string) {
  try {
    await db.notification.update({
      where: { id },
      data: { read: true, updatedAt: new Date() },
    });
    revalidatePath("/notifications");
    return { success: true };
  } catch (_error) {
    return { success: false };
  }
}

export async function broadcastAnnouncementAction(title: string, body: string) {
  try {
    // For simplicity, we create a notification for all active users
    // In a real app, this might be handled by a specific model or a more efficient broadcast system
    const users = await db.user.findMany({
      where: { isDeleted: false },
      select: { id: true },
    });

    await db.notification.createMany({
      data: users.map((u) => ({
        userId: u.id,
        title,
        body,
        meta: { system: true, broadcast: true },
      })),
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
