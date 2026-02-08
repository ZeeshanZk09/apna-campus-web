import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const programs = await prisma.program.findMany({
      include: {
        department: true,
        _count: {
          select: { cohorts: true },
        },
      },
    });

    return NextResponse.json({ success: true, programs });
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
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, description, durationMonths, departmentId } =
      await req.json();

    if (!name || !departmentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const program = await prisma.program.create({
      data: {
        name,
        description,
        durationMonths,
        departmentId,
      },
    });

    return NextResponse.json({ success: true, program });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create program" },
      { status: 500 },
    );
  }
}
