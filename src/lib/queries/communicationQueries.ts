// src/lib/queries/communicationQueries.ts
// Re-exports from the canonical chatQueries module for backward compatibility.
export {
  createAnnouncement,
  createConversation,
  getConversationMessages,
  getConversations,
  getConversationsByUserId,
  getMessagesByConversationId,
  getRecentBroadcasts,
  markAsRead,
  markMessageRead,
  sendMessage,
} from "./chatQueries";
