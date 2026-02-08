"use client";

import { Loader2, MessageSquare, Send, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useConversations,
  useMessages,
  useSendMessage,
} from "@/hooks/useCommunicationQueries";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  type: string;
  title: string | null;
  participants: {
    user: {
      id: string;
      name: string;
      username: string;
      profilePic: string | null;
    };
  }[];
  messages: {
    id: string;
    content: string;
    createdAt: string;
    senderUser: { name: string } | null;
  }[];
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderUser: {
    id: string;
    name: string;
    username: string;
    profilePic: string | null;
  } | null;
  readReceipts: { userId: string; readAt: string }[];
}

export function MessagingInterface({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: loadingConversations } =
    useConversations();
  const { data: messagesData, isLoading: loadingMessages } = useMessages(
    selectedConversation || "",
  );
  const sendMessageMutation = useSendMessage(selectedConversation || "");

  const messages: Message[] = messagesData?.data || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    sendMessageMutation.mutate({ content: messageInput.trim() });
    setMessageInput("");
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.title) return conv.title;
    const other = conv.participants.find((p) => p.user.id !== currentUserId);
    return other?.user.name || "Unknown";
  };

  const getConversationAvatar = (conv: Conversation) => {
    const other = conv.participants.find((p) => p.user.id !== currentUserId);
    return other?.user.profilePic;
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] rounded-lg border bg-background">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </h2>
        </div>
        <ScrollArea className="flex-1">
          {loadingConversations ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : conversations?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No conversations yet
            </div>
          ) : (
            conversations?.map((conv: Conversation) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => setSelectedConversation(conv.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left",
                  selectedConversation === conv.id && "bg-muted",
                )}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={getConversationAvatar(conv) || ""} />
                  <AvatarFallback>
                    {getConversationName(conv).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">
                      {getConversationName(conv)}
                    </p>
                    {conv.type === "GROUP" && (
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {conv.participants.length}
                      </Badge>
                    )}
                  </div>
                  {conv.messages[0] && (
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.messages[0].content}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              {conversations?.find(
                (c: Conversation) => c.id === selectedConversation,
              ) && (
                <>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getConversationName(
                        conversations.find(
                          (c: Conversation) => c.id === selectedConversation,
                        )!,
                      ).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {getConversationName(
                        conversations.find(
                          (c: Conversation) => c.id === selectedConversation,
                        )!,
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.senderUser?.id === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          isOwn ? "justify-end" : "justify-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-4 py-2",
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted",
                          )}
                        >
                          {!isOwn && msg.senderUser && (
                            <p className="text-xs font-medium mb-1">
                              {msg.senderUser.name}
                            </p>
                          )}
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={cn(
                              "text-[10px] mt-1",
                              isOwn
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground",
                            )}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={
                    !messageInput.trim() || sendMessageMutation.isPending
                  }
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
