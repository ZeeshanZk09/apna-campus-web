import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const courses = await prisma.course.findMany({
      include: {
        department: true,
        program: {
          select: { id: true, name: true },
        },
        _count: {
          select: { subjects: true, assignments: true },
        },
      },
    });

    return NextResponse.json({ success: true, courses });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, code, description, departmentId, programId, creditHours } =
      await req.json();

    if (!title || !code) {
      return NextResponse.json(
        { error: "Title and Code are required" },
        { status: 400 },
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        code,
        description,
        departmentId,
        programId,
        creditHours: creditHours ? parseInt(creditHours, 10) : undefined,
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create" },
      { status: 500 },
    );
  }
}
