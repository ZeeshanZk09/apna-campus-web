import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import ApiError from "@/lib/api/NextApiError";
import db from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return ApiError.unauthorized("Authentication required").toNextResponse();
    }

    const sessions = await db.session.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        ip: true,
        expiresAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error: any) {
    console.error("Fetch Sessions Error:", error);
    return ApiError.internal("Failed to fetch sessions").toNextResponse();
  }
}
