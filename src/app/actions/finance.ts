// src/app/actions/finance.ts
"use server";

import { revalidatePath } from "next/cache";
import { type FeeType, PaymentStatus } from "@/app/generated/prisma/enums";
import {
  createFeeStructure,
  createInvoice,
  createRefund,
  recordPayment,
  updateInvoiceStatus,
} from "@/lib/queries/financeQueries";

export async function createInvoiceAction(formData: FormData) {
  try {
    const feeId = formData.get("feeId") as string;
    const enrollmentId = formData.get("enrollmentId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const invoiceNo = formData.get("invoiceNo") as string;

    await createInvoice({ feeId, enrollmentId, amount, invoiceNo });
    revalidatePath("/admin/finance");
    return { success: true, message: "Invoice generated successfully" };
  } catch (_error) {
    return { success: false, message: "Failed to generate invoice" };
  }
}

export async function collectPaymentAction(invoiceId: string) {
  try {
    await updateInvoiceStatus(invoiceId, PaymentStatus.PAID);
    revalidatePath("/admin/finance");
    return { success: true, message: "Payment recorded successfully" };
  } catch (_error) {
    return { success: false, message: "Failed to record payment" };
  }
}

export async function createFeeAction(data: {
  title: string;
  amount: number;
  type: FeeType;
  dueDate?: Date;
}) {
  try {
    await createFeeStructure(data);
    revalidatePath("/admin/finance");
    return { success: true, message: "Fee structure created successfully" };
  } catch (_error) {
    return { success: false, message: "Failed to create fee structure" };
  }
}

export async function recordPaymentAction(data: {
  invoiceId: string;
  amount: number;
  provider: string;
  providerRef?: string | undefined;
}) {
  try {
    await recordPayment(data);
    revalidatePath("/admin/finance");
    return { success: true };
  } catch (_error) {
    return { success: false };
  }
}

export async function refundAction(data: {
  paymentId: string;
  amount: number;
  reason?: string;
}) {
  try {
    await createRefund(data);
    revalidatePath("/admin/finance");
    return { success: true };
  } catch (_error) {
    return { success: false };
  }
}
