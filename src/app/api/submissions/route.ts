import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

const submissionSchema = z.object({
  assignmentId: z.string().uuid(),
});

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (user?.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Only students can submit assignments" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { assignmentId } = submissionSchema.parse(body);

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: user.id,
      },
    });

    return NextResponse.json({ success: true, submission });
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

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const assignmentId = searchParams.get("assignmentId");

    const submissions = await prisma.submission.findMany({
      where: assignmentId ? { assignmentId } : {},
      include: {
        student: {
          select: { username: true, email: true },
        },
        assignment: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json({ success: true, submissions });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
