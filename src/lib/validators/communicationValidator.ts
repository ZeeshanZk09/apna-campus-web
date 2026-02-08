import { z } from "zod";

/**
 * Communication module validators.
 */

export const postSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  content: z.string().min(10, "Content must be at least 10 characters"),
  images: z.array(z.string().url()).optional(),
});

export const commentSchema = z
  .object({
    content: z.string().min(1, "Comment cannot be empty").max(2000),
    postId: z.string().uuid().optional(),
    assignmentId: z.string().uuid().optional(),
  })
  .refine((data) => data.postId || data.assignmentId, {
    message: "Either postId or assignmentId is required",
  });

export const notificationSchema = z.object({
  userId: z.string().uuid().optional(),
  adminId: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required").max(200),
  body: z.string().min(1, "Body is required").max(1000),
  role: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
});

export const messageSchema = z.object({
  conversationId: z.string().uuid("Conversation ID is required"),
  content: z.string().min(1, "Message cannot be empty").max(5000).optional(),
  attachments: z.array(z.string().url()).optional(),
});

export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type NotificationInput = z.infer<typeof notificationSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
