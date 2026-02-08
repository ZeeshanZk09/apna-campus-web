import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

const invoiceSchema = z.object({
  feeId: z.string().uuid(),
  enrollmentId: z.string().uuid(),
  amount: z.number().positive(),
  invoiceNo: z.string().min(1),
});

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const enrollmentId = searchParams.get("enrollmentId");

    // If student, only show their invoices
    const where: any = {};
    if (user.role === "STUDENT") {
      where.enrollment = { userId: user.id };
    } else if (user.role === "ADMIN" && enrollmentId) {
      where.enrollmentId = enrollmentId;
    } else if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        fee: true,
        enrollment: {
          include: {
            user: { select: { username: true } },
            cohort: { select: { name: true } },
          },
        },
        Payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, invoices });
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
    const data = invoiceSchema.parse(body);

    const invoice = await prisma.invoice.create({
      data,
    });

    return NextResponse.json({ success: true, invoice });
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
