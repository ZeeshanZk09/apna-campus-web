import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

const cohortSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  programId: z.string().uuid().optional().nullable(),
});

export async function GET() {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const classrooms = await prisma.cohort.findMany({
      include: {
        program: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ success: true, classrooms });
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
    const data = cohortSchema.parse(body);

    const classroom = await prisma.cohort.create({
      data: {
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate as string) : undefined,
        programId: data.programId ?? undefined,
      },
    });

    return NextResponse.json({ success: true, classroom });
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
