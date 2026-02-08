import { NextResponse } from "next/server";
// import { getSessionUser } from '@/app/actions/auth';
import { z } from "zod";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

const assignmentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  courseId: z.string().uuid(),
});

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    const assignments = await prisma.assignment.findMany({
      where: courseId ? { courseId } : {},
      include: {
        course: {
          select: { title: true, code: true },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });

    return NextResponse.json({ success: true, assignments });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    // Only teacher or admin can create assignments
    if (user?.role !== "ADMIN" && user?.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const data = assignmentSchema.parse(body);

    const assignment = await prisma.assignment.create({
      data,
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
