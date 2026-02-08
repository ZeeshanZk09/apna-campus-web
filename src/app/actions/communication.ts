// src/app/actions/communication.ts
"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";
import {
  createAnnouncement,
  createConversation,
  markMessageRead,
  sendMessage,
} from "@/lib/queries/communicationQueries";

export async function createAnnouncementAction(
  formData: FormData,
  adminId: string,
) {
  try {
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    await createAnnouncement({ title, body, adminId });

    await createAuditLog({
      action: "CREATE",
      resource: "Announcement",
      resourceId: "all",
      meta: { title },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendMessageAction(data: {
  conversationId: string;
  senderUserId?: string;
  senderAdminId?: string;
  content: string;
  attachments?: string[];
}) {
  try {
    const res = await sendMessage(data);

    // Optional: Only log group or sensitive message actions to avoid bloating logs
    // await createAuditLog('SEND_MESSAGE', 'Conversation', data.conversationId);

    revalidatePath("/admin/messages");
    return { success: true, data: res };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Message failed to send",
    };
  }
}

export async function createConversationAction(participantIds: string[]) {
  try {
    const res = await createConversation({
      participantIds,
    });

    await createAuditLog({
      action: "CREATE",
      resource: "Conversation",
      resourceId: res.id,
      meta: {
        participantCount: participantIds.length,
      },
    });

    revalidatePath("/admin/messages");
    return { success: true, data: res };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create conversation",
    };
  }
}

export async function markAsReadAction(messageId: string, userId: string) {
  try {
    await markMessageRead(messageId, userId);
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (_error) {
    return { success: false };
  }
}

export async function muteParticipantAction(
  participantId: string,
  durationMinutes: number,
) {
  try {
    const mutedUntil = new Date(Date.now() + durationMinutes * 60000);
    await db.conversationParticipant.update({
      where: { id: participantId },
      data: { mutedUntil },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateParticipantRoleAction(
  participantId: string,
  role: string,
) {
  try {
    await db.conversationParticipant.update({
      where: { id: participantId },
      data: { role },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
