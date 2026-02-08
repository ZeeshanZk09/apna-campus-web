import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const departments = await prisma.department.findMany({
      include: {
        programs: {
          include: {
            _count: {
              select: { cohorts: true },
            },
          },
        },
        _count: {
          select: { courses: true },
        },
      },
    });

    return NextResponse.json({ success: true, departments });
  } catch (error) {
    console.error("Dept Fetch Error:", error);
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

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: { name, description },
    });

    return NextResponse.json({ success: true, department });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 },
    );
  }
}
