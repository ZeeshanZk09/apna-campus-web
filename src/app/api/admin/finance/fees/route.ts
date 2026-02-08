import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

const feeSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  type: z.enum(["TUITION", "REGISTRATION", "OTHER"]),
  dueDate: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const fees = await prisma.fee.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, fees });
  } catch (_error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const data = feeSchema.parse(body);

    const fee = await prisma.fee.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    return NextResponse.json({ success: true, fee });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
