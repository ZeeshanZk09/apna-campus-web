// src/app/messages/[id]/page.tsx

import { notFound } from "next/navigation";
import { getSessionUser } from "@/app/actions/auth";
import {
  getConversations,
  getMessagesByConversationId,
} from "@/lib/queries/chatQueries";
import ChatSidebar from "../_components/ChatSidebar";
import ChatWindow from "../_components/ChatWindow";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: conversationId } = await params;

  const user = await getSessionUser();
  if (!user) return null;

  const [conversations, messages] = await Promise.all([
    getConversations(user.id),
    getMessagesByConversationId(conversationId),
  ]);

  const currentConversation = conversations.find(
    (c) => c.id === conversationId,
  );
  if (!currentConversation) notFound();

  return (
    <div className="flex h-full">
      <div className="hidden md:flex w-96 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <ChatSidebar conversations={conversations} currentUserId={user.id} />
      </div>

      <div className="flex-1 overflow-hidden bg-white dark:bg-gray-950">
        <ChatWindow
          conversation={currentConversation}
          messages={messages}
          currentUserId={user.id}
        />
      </div>
    </div>
  );
}
