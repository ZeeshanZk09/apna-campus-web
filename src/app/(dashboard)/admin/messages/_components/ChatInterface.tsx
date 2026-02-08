// src/app/admin/messages/_components/ChatInterface.tsx
"use client";

import { Search, Send, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { sendMessageAction } from "@/app/actions/communication";

interface Conversation {
  user: { id: string; name: string; image?: string | null };
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

export default function ChatInterface({
  currentUserId,
  initialConversations,
}: {
  currentUserId: string;
  initialConversations: Conversation[];
}) {
  const [selectedUser, setSelectedUser] = useState<Conversation["user"] | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [conversations] = useState(initialConversations);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !message.trim()) return;

    const res = await sendMessageAction({
      conversationId: selectedUser.id,
      content: message,
    });
    if (res.success) {
      setMessage("");
      toast.success("Message sent");
    } else {
      toast.error("Failed to send");
    }
  };

  return (
    <div className="flex h-full bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Sidebar: Conversations */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search people..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.user.id}
              onClick={() => setSelectedUser(conv.user)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors ${selectedUser?.id === conv.user.id ? "bg-muted" : ""}`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                {conv.user.image ? (
                  <img
                    src={conv.user.image}
                    alt={conv.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm truncate">
                    {conv.user.name}
                  </h3>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {new Date(conv.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {conv.lastMessage}
                </p>
              </div>
              {conv.unread && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-muted/20">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                {selectedUser.image ? (
                  <img
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h2 className="font-bold text-sm">{selectedUser.name}</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-muted-foreground">
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Placeholder */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-primary/40" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Select a message to view the conversation history.
                </p>
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-card border-t border-border flex gap-2"
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground p-2 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-primary/30" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your Inbox</h2>
            <p className="text-muted-foreground max-w-sm">
              Communicate with students, teachers, and administration in
              real-time. Select a conversation to start.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
