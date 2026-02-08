// src/lib/queries/contentQueries.ts
import db from "@/lib/prisma";

export async function createPostComment(data: {
  content: string;
  userId?: string;
  postId: string;
}) {
  return await db.comment.create({
    data: {
      content: data.content,
      userId: data.userId,
      postId: data.postId,
    },
  });
}

export async function likePost(postId: string) {
  return await db.post.update({
    where: { id: postId },
    data: {
      likes: { increment: 1 },
    },
  });
}

export async function uploadAsset(data: {
  url: string;
  key?: string;
  mimeType?: string;
  size?: number;
  createdById?: string;
}) {
  return await db.asset.create({
    data,
  });
}
