import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const fee = await db.fee.findUnique({
      where: { id },
      include: {
        invoices: {
          include: {
            enrollment: {
              include: {
                user: {
                  select: { id: true, name: true, username: true, email: true },
                },
                cohort: { select: { id: true, name: true } },
              },
            },
            Payment: { orderBy: { paidAt: "desc" } },
          },
          orderBy: { issuedAt: "desc" },
        },
      },
    });

    if (!fee) {
      return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: fee });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch fee details" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const fee = await db.fee.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.amount !== undefined && { amount: body.amount }),
        ...(body.type && { type: body.type }),
        ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
      },
    });

    return NextResponse.json({ success: true, data: fee });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to update fee" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if there are invoices linked to this fee
    const invoiceCount = await db.invoice.count({ where: { feeId: id } });
    if (invoiceCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete fee with existing invoices" },
        { status: 400 },
      );
    }

    await db.fee.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Fee deleted" });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete fee" },
      { status: 500 },
    );
  }
}
