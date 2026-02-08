// src/lib/queries/financeQueries.ts
import { type FeeType, PaymentStatus } from "@/app/generated/prisma/enums";
import db from "@/lib/prisma";

export async function createFeeStructure(data: {
  title: string;
  amount: number;
  type: FeeType;
  description?: string;
  dueDate?: Date;
}) {
  return await db.fee.create({
    data: {
      title: data.title,
      amount: data.amount,
      type: data.type,
      dueDate: data.dueDate,
    },
  });
}

export async function getAllFees() {
  return await db.fee.findMany();
}

export async function createInvoice(data: {
  feeId: string;
  enrollmentId: string;
  amount: number;
  invoiceNo: string;
}) {
  return await db.invoice.create({
    data: {
      feeId: data.feeId,
      enrollmentId: data.enrollmentId,
      amount: data.amount,
      invoiceNo: data.invoiceNo,
      status: PaymentStatus.PENDING,
    },
  });
}

export async function recordPayment(data: {
  invoiceId: string;
  amount: number;
  provider: string;
  providerRef?: string;
}) {
  return await db.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        invoiceId: data.invoiceId,
        amount: data.amount,
        provider: data.provider,
        providerRef: data.providerRef,
        status: PaymentStatus.PAID,
        paidAt: new Date(),
      },
    });

    // Update invoice status if fully paid
    await tx.invoice.update({
      where: { id: data.invoiceId },
      data: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
      },
    });

    return payment;
  });
}

export async function createRefund(data: {
  paymentId: string;
  amount: number;
  reason?: string;
}) {
  return await db.payment.update({
    where: { id: data.paymentId },
    data: {
      status: PaymentStatus.REFUNDED,
      updatedAt: new Date(),
    },
  });
}

export async function getAllInvoices() {
  return await db.invoice.findMany({
    include: {
      enrollment: {
        include: {
          user: { select: { name: true, email: true, profilePic: true } },
          cohort: { select: { name: true } },
        },
      },
      Payment: true,
      fee: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFinanceStats() {
  const [totalRevenue, pendingAmount, totalInvoices] = await Promise.all([
    db.payment.aggregate({ _sum: { amount: true }, where: { status: "PAID" } }),
    db.invoice.aggregate({
      where: { status: PaymentStatus.PENDING },
      _sum: { amount: true },
    }),
    db.invoice.count(),
  ]);

  return {
    revenue: totalRevenue._sum.amount || 0,
    pending: pendingAmount._sum.amount || 0,
    count: totalInvoices,
  };
}

export async function getUserInvoices(userId: string) {
  return await db.invoice.findMany({
    where: {
      enrollment: {
        userId: userId,
      },
    },
    include: {
      fee: true,
      Payment: true,
    },
    orderBy: { issuedAt: "desc" },
  });
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: PaymentStatus,
) {
  return await db.invoice.update({
    where: { id: invoiceId },
    data: { status },
  });
}
