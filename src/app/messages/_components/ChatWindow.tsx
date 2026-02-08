"use client";

import {
  CheckCheck,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { sendMessageAction } from "@/app/actions/communication";

interface ChatWindowProps {
  conversation: any;
  messages: any[];
  currentUserId: string;
}

export default function ChatWindow({
  conversation,
  messages: initialMessages,
  currentUserId,
}: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const otherParticipant =
    conversation.participants.find((p: any) => p.userId !== currentUserId)
      ?.user || conversation.participants[0]?.user;

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    setIsSending(true);
    // Optimistic update
    const tempId = Math.random().toString();
    const newMessage = {
      id: tempId,
      content,
      senderUserId: currentUserId,
      createdAt: new Date(),
    };
    setMessages([...messages, newMessage]);
    setContent("");

    try {
      const result = await sendMessageAction({
        conversationId: conversation.id,
        senderUserId: currentUserId,
        content,
      });

      if (!result.success) {
        toast.error("Message failed to send");
        setMessages(messages.filter((m) => m.id !== tempId));
      }
    } catch (_error) {
      toast.error("An error occurred");
      setMessages(messages.filter((m) => m.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Premium Header */}
      <header className="px-10 py-6 bg-white/80 backdrop-blur-xl border-b border-border flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            {otherParticipant?.profilePic ? (
              <img
                src={otherParticipant.profilePic}
                alt=""
                className="w-12 h-12 rounded-2xl object-cover shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-sm">
                {(
                  otherParticipant?.name ||
                  otherParticipant?.username ||
                  "U"
                ).charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-black text-lg tracking-tight uppercase italic">
              {otherParticipant?.name || otherParticipant?.username}
            </h2>
            <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">
              Online Now
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 hover:bg-muted rounded-2xl transition-all text-slate-400 hover:text-black focus:outline-none">
            <Search size={20} />
          </button>
          <button className="p-3 hover:bg-muted rounded-2xl transition-all text-slate-400 hover:text-black focus:outline-none">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Message Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar scroll-smooth"
      >
        {messages.map((msg, idx) => {
          const isMe =
            msg.senderUserId === currentUserId ||
            msg.senderAdminId === currentUserId;
          const showTime =
            idx === 0 ||
            new Date(msg.createdAt).getTime() -
              new Date(messages[idx - 1].createdAt).getTime() >
              1000 * 60 * 5;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-2`}
            >
              {showTime && (
                <span className="w-full text-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 my-4">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
              <div
                className={`max-w-[70%] px-6 py-4 rounded-[1.5rem] text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                  isMe
                    ? "bg-black text-white rounded-tr-none"
                    : "bg-white text-slate-900 border border-border rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
              {isMe && (
                <div className="flex items-center gap-1 text-emerald-500 px-1">
                  <CheckCheck size={12} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white/50 backdrop-blur-md border-t border-border">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-2 border-r border-border/50">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-black transition-colors"
            >
              <Paperclip size={18} />
            </button>
          </div>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a message, command or feedback..."
            className="w-full pl-20 pr-16 py-6 bg-white border-2 border-border/50 rounded-[2rem] text-sm font-bold shadow-2xl focus:border-black focus:ring-0 transition-all placeholder:text-slate-300"
          />
          <button
            type="submit"
            disabled={!content.trim() || isSending}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:scale-100 transition-all"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center mt-4 text-[9px] font-black uppercase tracking-widest text-slate-300 animate-pulse">
          Secure E2E Encrypted Protocol Active
        </p>
      </div>
    </div>
  );
}
