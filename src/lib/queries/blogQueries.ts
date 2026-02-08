// src/lib/queries/blogQueries.ts
import db from "@/lib/prisma";

export async function getAllPosts() {
  return await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          username: true,
          profilePic: true,
        },
      },
      admin: {
        select: {
          firstName: true,
          profilePic: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });
}

export async function getPostBySlug(slug: string) {
  return await db.post.findUnique({
    where: { slug },
    include: {
      admin: {
        select: {
          firstName: true,
          profilePic: true,
        },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              username: true,
              profilePic: true,
            },
          },
        },
      },
    },
  });
}

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  adminId: string;
  images?: string[];
}) {
  return await db.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      adminId: data.adminId,
      images: data.images || [],
    },
  });
}

export async function deletePost(id: string) {
  return await db.post.delete({
    where: { id },
  });
}
