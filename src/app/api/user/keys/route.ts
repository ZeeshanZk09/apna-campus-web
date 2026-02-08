import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/audit";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const keys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(keys);
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await request.json();
    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const key = `ak_${crypto.randomBytes(24).toString("hex")}`;

    const newKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        name,
        key, // In real world, we should only show this once and store a hash
      },
    });

    await createAuditLog({
      userId: user.id,
      action: "API_KEY_CREATE",
      resource: "API_KEY",
      resourceId: newKey.id,
      status: "SUCCESS",
      meta: { name },
    });

    return NextResponse.json(newKey);
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
