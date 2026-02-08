import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import prisma from "@/lib/prisma";

// const db = getPrisma();

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken) {
      try {
        const decoded = decodeJwt(accessToken);
        if (decoded?.sub) {
          await createAuditLog({
            userId: decoded.sub,
            action: "LOGOUT",
            resource: "AUTH",
            resourceId: decoded.sub,
            status: "SUCCESS",
          });
        }
      } catch (_e) {
        // Ignore decode issues
      }
    }

    if (refreshToken) {
      try {
        await prisma.session.deleteMany({
          where: {
            refreshToken: refreshToken,
          },
        });
      } catch (error) {
        console.error("Failed to delete session from DB", error);
      }
    }

    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
