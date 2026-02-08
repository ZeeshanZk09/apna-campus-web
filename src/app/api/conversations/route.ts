import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await db.conversation.findMany({
      where: {
        participants: { some: { userId: user.id } },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profilePic: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            senderUser: { select: { id: true, name: true, username: true } },
          },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    return NextResponse.json({ success: true, data: conversations });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type = "DIRECT", title, participantIds } = body;

    if (
      !participantIds ||
      !Array.isArray(participantIds) ||
      participantIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Participants are required" },
        { status: 400 },
      );
    }

    // For direct messages, check if a conversation already exists
    if (type === "DIRECT" && participantIds.length === 1) {
      const existing = await db.conversation.findFirst({
        where: {
          type: "DIRECT",
          participants: {
            every: { userId: { in: [user.id, participantIds[0]] } },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  profilePic: true,
                },
              },
            },
          },
        },
      });

      if (existing) {
        return NextResponse.json({ success: true, data: existing });
      }
    }

    const conversation = await db.conversation.create({
      data: {
        type,
        title: title || null,
        createdByUserId: user.id,
        participants: {
          create: [
            { userId: user.id, role: "MEMBER" },
            ...participantIds.map((id: string) => ({
              userId: id,
              role: "MEMBER" as string,
            })),
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: conversation },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 },
    );
  }
}
