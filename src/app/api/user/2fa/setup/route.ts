import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import ApiError from "@/lib/api/NextApiError";
import { generate2FASecret, generateQRCode } from "@/lib/auth/2fa";
import db from "@/lib/prisma";

export async function POST() {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return ApiError.unauthorized("Authentication required").toNextResponse();
    }

    const user = await db.user.findUnique({
      where: { id: sessionUser.id },
      select: { id: true, email: true, twoFactorEnabled: true },
    });

    if (!user) {
      return ApiError.unauthorized("User not found").toNextResponse();
    }

    if (user.twoFactorEnabled) {
      return ApiError.badRequest("2FA is already enabled").toNextResponse();
    }

    const { secret, otpauthUrl } = generate2FASecret(user.email);
    const qrCodeUrl = await generateQRCode(otpauthUrl);

    // Store the secret temporarily (or just return it to the client to send back for verification)
    // For better security, we store it in the DB but mark it as pending verification.
    // However, the current schema doesn't have a 'pendingSecret' field.
    // We'll update the user with the secret but won't set twoFactorEnabled to true yet.

    await db.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    return NextResponse.json({
      success: true,
      qrCodeUrl,
      secret, // Providing the text code for manual entry
    });
  } catch (error: any) {
    console.error("2FA Setup Error:", error);
    return ApiError.internal("Failed to generate 2FA setup").toNextResponse();
  }
}
