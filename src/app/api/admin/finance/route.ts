import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/actions/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (user?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    // Aggregate total revenue (sum of payments)
    const payments = await prisma.payment.findMany({
      where: { status: "PAID" },
      select: { amount: true },
    });

    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

    const pendingInvoices = await prisma.invoice.count({
      where: { status: "PENDING" },
    });

    const recentTransactions = await prisma.payment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        invoice: {
          include: {
            enrollment: {
              include: {
                user: { select: { username: true, email: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalRevenue,
        pendingInvoices,
        activeScholarships: 0, // Placeholder
      },
      recentTransactions,
    });
  } catch (_error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
