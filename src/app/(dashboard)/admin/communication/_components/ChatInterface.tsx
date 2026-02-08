// src/app/admin/communication/_components/ChatInterface.tsx
"use client";

import { Paperclip, Search, Send } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { sendMessageAction } from "@/app/actions/communication";

export default function ChatInterface({
  conversations: initialConversations,
}: {
  conversations: any[];
}) {
  const [conversations, _setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const [message, setMessage] = useState("");

  const activeConversation = conversations.find((c) => c.id === activeId);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeId) return;

    // Optimistic update would go here
    const res = await sendMessageAction({
      conversationId: activeId,
      content: message,
    });

    if (res.success) {
      setMessage("");
      // In a real app, you'd use Pusher/Socket.io or revalidatePath
      // For now, we manually update for the demo if needed or just clear.
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Conversation List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${activeId === conv.id ? "bg-muted border-l-4 border-primary" : ""}`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                {conv.participants[0]?.user.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate text-sm">
                  {conv.participants
                    .map((p: any) => p.user.username)
                    .join(", ")}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {conv.messages[0]?.content || "No messages yet"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-muted/20">
        {activeConversation ? (
          <>
            <div className="p-4 bg-background border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {activeConversation.participants[0]?.user.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm">
                    {activeConversation.participants
                      .map((p: any) => p.user.username)
                      .join(", ")}
                  </div>
                  <div className="text-xs text-green-500 font-medium">
                    Online
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeConversation.messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === "current-user-id" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.senderId === "current-user-id" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-background border rounded-tl-none font-medium text-gray-800"}`}
                  >
                    {msg.content}
                    <div
                      className={`text-[10px] mt-1 opacity-70 ${msg.senderId === "current-user-id" ? "text-right" : "text-left"}`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-background border-t">
              <form onSubmit={handleSend} className="flex gap-2">
                <button
                  type="button"
                  className="p-2 text-muted-foreground hover:text-primary"
                >
                  <Paperclip size={20} />
                </button>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-muted/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground p-2 rounded-xl hover:opacity-90 transition-all"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
