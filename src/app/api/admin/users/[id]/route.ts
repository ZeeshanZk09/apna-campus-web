import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import db from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validators/userValidator";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        gender: true,
        isBlocked: true,
        createdAt: true,
        profilePic: true,
        coverPic: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.format() },
        { status: 400 },
      );
    }

    const updateData: any = { ...result.data };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: user });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Soft delete
    await db.user.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
