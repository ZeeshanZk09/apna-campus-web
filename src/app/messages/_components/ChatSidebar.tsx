"use client";

import { MessageSquare, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

interface ChatSidebarProps {
  conversations: any[];
  currentUserId: string;
}

export default function ChatSidebar({
  conversations,
  currentUserId,
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  const currentId = params.id as string;

  const filteredConversations = conversations.filter((conv) => {
    // Check both participants since we filtered out "self" in the query,
    // but defensive coding is good.
    const otherParticipant =
      conv.participants.find((p: any) => p.userId !== currentUserId)?.user ||
      conv.participants[0]?.user;
    return (otherParticipant?.name || otherParticipant?.username || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-8 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
              <MessageSquare size={16} className="text-white" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">
              Inbox
            </h2>
          </div>
          <button className="p-2 hover:bg-muted rounded-xl transition-all active:scale-95">
            <Plus
              size={20}
              className="text-muted-foreground hover:text-black transition-colors"
            />
          </button>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-black transition-colors"
            size={16}
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chats..."
            className="w-full bg-muted/50 border-none rounded-2xl pl-12 pr-4 py-4 text-xs font-bold focus:ring-2 focus:ring-black transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto mt-4 px-4 pb-8 space-y-1 custom-scrollbar">
        {filteredConversations.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquare
              size={40}
              className="mx-auto text-muted-foreground/20 mb-4"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Silenced...
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const otherParticipant =
              conv.participants.find((p: any) => p.userId !== currentUserId)
                ?.user || conv.participants[0]?.user;
            const lastMessage = conv.messages[0];
            const isActive = currentId === conv.id;

            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className={`flex items-center gap-4 p-4 rounded-[1.5rem] transition-all group ${
                  isActive
                    ? "bg-black text-white shadow-xl translate-x-1"
                    : "hover:bg-muted"
                }`}
              >
                <div className="relative flex-shrink-0">
                  {otherParticipant?.profilePic ? (
                    <img
                      src={otherParticipant.profilePic}
                      alt=""
                      className="w-12 h-12 rounded-[1rem] object-cover ring-2 ring-transparent group-hover:ring-black/10"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-black text-sm ${
                        isActive ? "bg-white/20" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {(
                        otherParticipant?.name ||
                        otherParticipant?.username ||
                        "U"
                      ).charAt(0)}
                    </div>
                  )}
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${isActive ? "bg-emerald-400 border-black" : "bg-emerald-500 border-white"}`}
                  ></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3
                      className={`font-black text-xs truncate uppercase tracking-tight ${isActive ? "text-white" : "text-slate-900"}`}
                    >
                      {otherParticipant?.name || otherParticipant?.username}
                    </h3>
                    <span
                      className={`text-[9px] font-bold uppercase opacity-50`}
                    >
                      {lastMessage
                        ? new Date(lastMessage.createdAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : ""}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] truncate ${isActive ? "text-slate-300" : "text-slate-500 font-medium"}`}
                  >
                    {lastMessage ? lastMessage.content : "No messages yet"}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
