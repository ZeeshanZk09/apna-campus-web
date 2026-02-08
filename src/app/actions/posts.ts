// src/app/actions/posts.ts
"use server";

import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";
import { createPost, deletePost } from "@/lib/queries/blogQueries";

export async function createPostAction(formData: FormData, adminId: string) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const images = formData.getAll("images") as string[];
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    const post = await createPost({ title, slug, content, adminId, images });

    await createAuditLog({
      action: "CREATE",
      resource: "Post",
      resourceId: post.id,
      meta: { title, slug },
    });

    revalidatePath("/admin/monitoring/news");
    revalidatePath("/blog");
    return { success: true, message: "Post published successfully" };
  } catch (_error) {
    return { success: false, message: "Failed to publish post" };
  }
}

export async function likePostAction(postId: string) {
  try {
    await db.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });
    revalidatePath("/blog");
    return { success: true };
  } catch (_error) {
    return { success: false };
  }
}

export async function addCommentAction(data: {
  content: string;
  userId?: string;
  adminId?: string;
  postId?: string;
  assignmentId?: string;
}) {
  try {
    await db.comment.create({
      data: {
        content: data.content,
        userId: data.userId,
        adminId: data.adminId,
        postId: data.postId,
        assignmentId: data.assignmentId,
      },
    });

    if (data.postId) revalidatePath(`/blog/${data.postId}`);
    if (data.assignmentId)
      revalidatePath(`/admin/academics/assignments/${data.assignmentId}`);

    return { success: true };
  } catch (_error) {
    return { success: false };
  }
}

export async function deletePostAction(id: string) {
  try {
    await deletePost(id);
    revalidatePath("/admin/monitoring/news");
    return { success: true, message: "Post deleted successfully" };
  } catch (_error) {
    return { success: false, message: "Failed to delete post" };
  }
}
