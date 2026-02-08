// src/app/admin/messages/page.tsx

import { MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/authHelpers";
import { getConversations } from "@/lib/queries/communicationQueries";
import ChatInterface from "./_components/ChatInterface";

export default async function MessagesPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const conversations = await getConversations(session.id);

  return (
    <div className="h-[calc(100vh-100px)] p-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold">Communications</h1>
      </div>

      <ChatInterface
        currentUserId={session.id}
        initialConversations={conversations as any}
      />
    </div>
  );
}
