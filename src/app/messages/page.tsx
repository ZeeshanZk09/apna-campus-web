// src/app/messages/page.tsx

import { Mail } from "lucide-react";
import { getSessionUser } from "@/app/actions/auth";
import { getConversations } from "@/lib/queries/chatQueries";
import ChatSidebar from "./_components/ChatSidebar";

export default async function MessagesPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const conversations = await getConversations(user.id);

  return (
    <div className="flex h-full">
      <div className="w-full md:w-96 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <ChatSidebar conversations={conversations} currentUserId={user.id} />
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
            <Mail size={40} />
          </div>
          <h3 className="text-xl font-bold dark:text-white">Your Messages</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-2 text-sm">
            Select a conversation from the sidebar to start chatting with
            teachers, students or support.
          </p>
        </div>
      </div>
    </div>
  );
}
