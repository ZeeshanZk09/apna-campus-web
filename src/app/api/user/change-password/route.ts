import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Fetch user with password
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isMatch = await compare(currentPassword, dbUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await createAuditLog({
      userId: user.id,
      action: "PASSWORD_CHANGE",
      resource: "USER",
      resourceId: user.id,
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
