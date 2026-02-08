import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { username: true } },
        admin: { select: { firstName: true } },
      },
    });
    return NextResponse.json({ success: true, posts });
  } catch (_error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { title, content } = await req.json();

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (_error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
