import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN" && user?.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, content, subjectId, order } = await req.json();

    if (!title || !subjectId) {
      return NextResponse.json(
        { error: "Missing title or subjectId" },
        { status: 400 },
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        subjectId,
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, lesson });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN" && user?.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, ...data } = await req.json();

    const lesson = await prisma.lesson.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, lesson });
  } catch (_error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
