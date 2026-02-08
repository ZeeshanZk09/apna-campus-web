import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";
import { sanitizeText } from "@/lib/utils/sanitize";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const post = await db.post.findUnique({
      where: { slug },
      include: {
        user: {
          select: { id: true, name: true, username: true, profilePic: true },
        },
        admin: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();

    const post = await db.post.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Only the author or admin can update
    if (post.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.post.update({
      where: { slug },
      data: {
        ...(body.title && { title: sanitizeText(body.title) }),
        ...(body.content && { content: sanitizeText(body.content) }),
        ...(body.images && { images: body.images }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const post = await db.post.findUnique({ where: { slug } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Only the author or admin can delete
    if (post.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete comments first, then post
    await db.comment.deleteMany({ where: { postId: post.id } });
    await db.post.delete({ where: { slug } });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
