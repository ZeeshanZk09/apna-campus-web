import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") || "";
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || "30")),
    );

    // Verify user is a participant
    const participant = await db.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: id, userId: user.id } },
    });

    if (!participant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    const messages = await db.message.findMany({
      where: { conversationId: id },
      take: limit,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: "desc" },
      include: {
        senderUser: {
          select: { id: true, name: true, username: true, profilePic: true },
        },
        readReceipts: { select: { userId: true, readAt: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: messages.reverse(),
      metadata: {
        hasMore: messages.length === limit,
        cursor: messages.length > 0 ? messages[0].id : null,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (
      !body.content?.trim() &&
      (!body.attachments || body.attachments.length === 0)
    ) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 },
      );
    }

    // Verify user is a participant and can write
    const participant = await db.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId: id, userId: user.id } },
    });

    if (!participant) {
      return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    }

    if (!participant.canWrite) {
      return NextResponse.json(
        { error: "You are muted in this conversation" },
        { status: 403 },
      );
    }

    const message = await db.message.create({
      data: {
        conversationId: id,
        senderUserId: user.id,
        content: body.content?.trim() || null,
        attachments: body.attachments || [],
      },
      include: {
        senderUser: {
          select: { id: true, name: true, username: true, profilePic: true },
        },
      },
    });

    // Update conversation's last message
    await db.conversation.update({
      where: { id },
      data: { lastMessageId: message.id, lastMessageAt: new Date() },
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
