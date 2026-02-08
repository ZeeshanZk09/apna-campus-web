import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ notifications });
  } catch (_error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
