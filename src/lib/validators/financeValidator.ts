import { z } from "zod";

/**
 * Finance module validators.
 */

export const feeSchema = z.object({
  title: z.string().min(2, "Title is required").max(200),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["TUITION", "REGISTRATION", "OTHER"]),
  dueDate: z.string().or(z.date()).optional(),
});

export const invoiceSchema = z.object({
  feeId: z.string().uuid("Fee ID is required"),
  enrollmentId: z.string().uuid().optional(),
  amount: z.number().positive("Amount must be positive"),
});

export const paymentSchema = z.object({
  invoiceId: z.string().uuid("Invoice ID is required"),
  provider: z.string().min(1, "Provider is required"),
  providerRef: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
});

export type FeeInput = z.infer<typeof feeSchema>;
export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
