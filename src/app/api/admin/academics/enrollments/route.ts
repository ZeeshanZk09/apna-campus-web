import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

const enrollmentSchema = z.object({
  userId: z.string().uuid(),
  cohortId: z.string().uuid(),
  status: z.enum(["ACTIVE", "COMPLETED", "WITHDRAWN", "SUSPENDED"]).optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const cohortId = searchParams.get("cohortId");

    const enrollments = await prisma.enrollment.findMany({
      where: cohortId ? { cohortId } : {},
      include: {
        user: {
          select: { username: true, email: true, role: true },
        },
        cohort: {
          select: { name: true, program: { select: { name: true } } },
        },
      },
    });

    return NextResponse.json({ success: true, enrollments });
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
    if (user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const data = enrollmentSchema.parse(body);

    const enrollment = await prisma.enrollment.create({
      data,
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    // Check for unique constraint violation
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "User is already enrolled in this cohort" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
