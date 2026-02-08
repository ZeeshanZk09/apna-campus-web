// src/lib/queries/chatQueries.ts
// Canonical messaging queries - consolidates chatQueries + communicationQueries
import type { ConversationType } from "@/app/generated/prisma/enums";
import db from "@/lib/prisma";

export async function createConversation(data: {
  type?: ConversationType;
  participantIds: string[];
  title?: string;
  createdByUserId?: string;
}) {
  return await db.conversation.create({
    data: {
      type: data.type,
      title: data.title,
      createdByUserId: data.createdByUserId,
      participants: {
        create: data.participantIds.map((id) => ({
          userId: id,
        })),
      },
    },
    include: {
      participants: {
        include: { user: true },
      },
    },
  });
}

export async function sendMessage(data: {
  conversationId: string;
  senderUserId?: string;
  senderAdminId?: string;
  content: string;
  attachments?: string[];
}) {
  const message = await db.message.create({
    data: {
      conversationId: data.conversationId,
      senderUserId: data.senderUserId,
      senderAdminId: data.senderAdminId,
      content: data.content,
      attachments: data.attachments || [],
    },
    include: {
      senderUser: { select: { username: true, profilePic: true } },
      senderAdmin: { select: { id: true, firstName: true, profilePic: true } },
    },
  });

  // Update conversation last message timestamp
  await db.conversation.update({
    where: { id: data.conversationId },
    data: {
      lastMessageId: message.id,
      lastMessageAt: new Date(),
    },
  });

  return message;
}

export async function getConversations(userId: string) {
  return await db.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      participants: {
        include: {
          user: {
            select: { id: true, username: true, profilePic: true, role: true },
          },
        },
      },
    },
    orderBy: { lastMessageAt: "desc" },
  });
}

/** Alias for backward compatibility */
export const getConversationsByUserId = getConversations;

export async function getMessagesByConversationId(conversationId: string) {
  return await db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      senderUser: { select: { id: true, username: true, profilePic: true } },
      senderAdmin: { select: { id: true, firstName: true, profilePic: true } },
    },
  });
}

/** Alias for backward compatibility */
export const getConversationMessages = getMessagesByConversationId;

export async function markAsRead(messageId: string, userId: string) {
  return await db.messageReadReceipt.upsert({
    where: {
      messageId_userId: { messageId, userId },
    },
    update: { readAt: new Date() },
    create: { messageId, userId },
  });
}

/** Alias for backward compatibility */
export const markMessageRead = markAsRead;

/**
 * Create a broadcast announcement — sends a notification to all active users.
 */
export async function createAnnouncement(data: {
  title: string;
  body: string;
  adminId: string;
}) {
  const users = await db.user.findMany({
    where: { isDeleted: false },
    select: { id: true },
  });

  const notifications = users.map((user) => ({
    userId: user.id,
    adminId: data.adminId,
    title: data.title,
    body: data.body,
  }));

  return await db.notification.createMany({
    data: notifications,
  });
}

/**
 * Get recent broadcast notifications (announcements sent by admins).
 */
export async function getRecentBroadcasts(limit = 10) {
  return await db.notification.findMany({
    where: {
      adminId: { not: null },
    },
    distinct: ["title"],
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      admin: { select: { firstName: true } },
    },
  });
}
