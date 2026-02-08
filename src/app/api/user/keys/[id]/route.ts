import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey || apiKey.userId !== user.id) {
      return NextResponse.json({ error: "Key not found" }, { status: 404 });
    }

    await prisma.apiKey.delete({
      where: { id },
    });

    await createAuditLog({
      userId: user.id,
      action: "API_KEY_DELETE",
      resource: "API_KEY",
      resourceId: id,
      status: "SUCCESS",
      meta: { name: apiKey.name },
    });

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
