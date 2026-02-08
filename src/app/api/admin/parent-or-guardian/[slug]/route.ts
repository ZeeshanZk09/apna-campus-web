import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validators/userValidator";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const parent = await db.user.findFirst({
      where: {
        id: slug,
        role: { in: ["PARENT", "GUARDIAN"] },
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        gender: true,
        profilePic: true,
        coverPic: true,
        isBlocked: true,
        createdAt: true,
        updatedAt: true,
        parentChildren: {
          select: {
            id: true,
            relation: true,
            child: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
                enrollments: {
                  select: { status: true, cohort: { select: { name: true } } },
                },
              },
            },
          },
        },
      },
    });

    if (!parent) {
      return NextResponse.json(
        { error: "Parent/guardian not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: parent });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch parent/guardian" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const result = updateUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = { ...result.data };
    if (typeof updateData.password === "string" && updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }

    const parent = await db.user.update({
      where: { id: slug },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isBlocked: true,
      },
    });

    return NextResponse.json({ success: true, data: parent });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update parent/guardian" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    await db.user.update({ where: { id: slug }, data: { isDeleted: true } });
    return NextResponse.json({
      success: true,
      message: "Parent/guardian deleted successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete parent/guardian" },
      { status: 500 },
    );
  }
}
