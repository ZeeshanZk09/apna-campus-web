import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import db from "@/lib/prisma";
import { paymentSchema } from "@/lib/validators/financeValidator";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") || "20")),
    );
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          invoice: {
            include: {
              fee: { select: { title: true, type: true } },
              enrollment: {
                include: {
                  user: { select: { id: true, name: true, username: true } },
                  cohort: { select: { name: true } },
                },
              },
            },
          },
        },
      }),
      db.payment.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: payments,
      metadata: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || !["ADMIN", "STAFF"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = paymentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message },
        { status: 400 },
      );
    }

    const { invoiceId, amount, provider, providerRef } = result.data;

    // Verify invoice exists and is pending
    const invoice = await db.invoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    if (invoice.status === "PAID") {
      return NextResponse.json(
        { error: "Invoice already paid" },
        { status: 400 },
      );
    }

    // Create payment and update invoice status
    const [payment] = await db.$transaction([
      db.payment.create({
        data: {
          invoiceId,
          amount,
          provider,
          providerRef: providerRef || null,
          status: "PAID",
          paidAt: new Date(),
        },
      }),
      db.invoice.update({
        where: { id: invoiceId },
        data: { status: "PAID", paidAt: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 },
    );
  }
}
