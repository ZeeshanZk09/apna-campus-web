import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        subjects: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
        department: true,
        program: { select: { id: true, name: true } },
      },
    });

    if (!course)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, course });
  } catch (_error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const course = await prisma.course.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, course });
  } catch (_error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    if (user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
