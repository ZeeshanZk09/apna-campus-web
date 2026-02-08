import { type NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import ApiError from "@/lib/api/NextApiError";
import { createAuditLog } from "@/lib/audit";
import { verify2FAToken } from "@/lib/auth/2fa";
import db from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return ApiError.unauthorized("Authentication required").toNextResponse();
    }

    const { token } = await req.json();
    if (!token) {
      return ApiError.badRequest(
        "Verification token is required",
      ).toNextResponse();
    }

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!dbUser?.twoFactorSecret) {
      return ApiError.badRequest(
        "2FA setup has not been initiated",
      ).toNextResponse();
    }

    const isValid = verify2FAToken(token, dbUser.twoFactorSecret);

    if (!isValid) {
      return ApiError.badRequest("Invalid verification token").toNextResponse();
    }

    await db.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    });

    await createAuditLog({
      action: "ENABLE_2FA",
      resource: "USER",
      resourceId: user.id,
      userId: user.id,
      meta: { details: "Two-factor authentication enabled successfully" },
    });

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication enabled successfully",
    });
  } catch (error: any) {
    console.error("2FA Verification Error:", error);
    return ApiError.internal("Failed to verify 2FA token").toNextResponse();
  }
}
