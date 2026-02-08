import { type NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import ApiError from "@/lib/api/NextApiError";
import { createAuditLog } from "@/lib/audit";
import db from "@/lib/prisma";

export async function POST(_req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return ApiError.unauthorized("Authentication required").toNextResponse();
    }

    // Usually, you should ask for a password or a final 2FA token to disable it.
    // For now, we'll implement it as a simple post-authentication action.

    await db.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    await createAuditLog({
      action: "DISABLE_2FA",
      resource: "USER",
      resourceId: user.id,
      userId: user.id,
      meta: { details: "Two-factor authentication disabled" },
    });

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication disabled successfully",
    });
  } catch (error: any) {
    console.error("2FA Disable Error:", error);
    return ApiError.internal("Failed to disable 2FA").toNextResponse();
  }
}
