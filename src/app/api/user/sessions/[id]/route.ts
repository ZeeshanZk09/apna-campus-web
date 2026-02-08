import { type NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import ApiError from "@/lib/api/NextApiError";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return ApiError.unauthorized("Authentication required").toNextResponse();
    }

    const { id: sessionId } = await params;

    const session = await db.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== user.id) {
      return ApiError.notFound(
        "Session not found or not owned by user",
      ).toNextResponse();
    }

    await db.session.delete({
      where: { id: sessionId },
    });

    await createAuditLog({
      action: "LOGOUT_DEVICE",
      resource: "SESSION",
      resourceId: sessionId,
      userId: user.id,
      meta: { ip: session.ip },
    });

    return NextResponse.json({
      success: true,
      message: "Session terminated successfully",
    });
  } catch (error: any) {
    console.error("Delete Session Error:", error);
    return ApiError.internal("Failed to terminate session").toNextResponse();
  }
}
