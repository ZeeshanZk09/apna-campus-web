"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ============================================
// Query Keys
// ============================================

export const COMMUNICATION_QUERY_KEYS = {
  conversations: ["conversations"],
  messages: (conversationId: string) => [
    "conversations",
    conversationId,
    "messages",
  ],
  notifications: ["notifications"],
};

// ============================================
// Conversations
// ============================================

export function useConversations() {
  return useQuery({
    queryKey: COMMUNICATION_QUERY_KEYS.conversations,
    queryFn: async () => {
      const { data } = await axios.get("/api/conversations");
      return data.data;
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      type?: string;
      title?: string;
      participantIds: string[];
    }) => {
      const { data } = await axios.post("/api/conversations", payload);
      return data.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: COMMUNICATION_QUERY_KEYS.conversations,
      }),
  });
}

// ============================================
// Messages
// ============================================

export function useMessages(
  conversationId: string,
  options?: { cursor?: string },
) {
  return useQuery({
    queryKey: COMMUNICATION_QUERY_KEYS.messages(conversationId),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (options?.cursor) searchParams.set("cursor", options.cursor);
      const { data } = await axios.get(
        `/api/conversations/${conversationId}?${searchParams.toString()}`,
      );
      return data;
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      content: string;
      attachments?: string[];
    }) => {
      const { data } = await axios.post(
        `/api/conversations/${conversationId}`,
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COMMUNICATION_QUERY_KEYS.messages(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: COMMUNICATION_QUERY_KEYS.conversations,
      });
    },
  });
}

// ============================================
// Notifications
// ============================================

export function useNotifications() {
  return useQuery({
    queryKey: COMMUNICATION_QUERY_KEYS.notifications,
    queryFn: async () => {
      const { data } = await axios.get("/api/user/notifications");
      return data;
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.put(`/api/user/notifications/${id}`);
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: COMMUNICATION_QUERY_KEYS.notifications,
      }),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/user/notifications/${id}`);
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: COMMUNICATION_QUERY_KEYS.notifications,
      }),
  });
}

export function useBroadcastNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      body: string;
      userId?: string;
      role?: string;
    }) => {
      const { data } = await axios.post("/api/admin/notifications", payload);
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] }),
  });
}
