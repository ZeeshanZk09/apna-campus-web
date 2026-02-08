"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { PaginationParams } from "@/types";

// ============================================
// Query Keys
// ============================================

export const FINANCE_QUERY_KEYS = {
  summary: ["finance", "summary"],
  fees: (params?: PaginationParams) => ["finance", "fees", params],
  feeDetail: (id: string) => ["finance", "fee", id],
  invoices: (params?: PaginationParams) => ["finance", "invoices", params],
  payments: (params?: PaginationParams & { status?: string }) => [
    "finance",
    "payments",
    params,
  ],
};

// ============================================
// Finance Summary
// ============================================

export function useFinanceSummary() {
  return useQuery({
    queryKey: FINANCE_QUERY_KEYS.summary,
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/finance");
      return data.data;
    },
  });
}

// ============================================
// Fees
// ============================================

export function useFees(params?: PaginationParams) {
  return useQuery({
    queryKey: FINANCE_QUERY_KEYS.fees(params),
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/finance/fees");
      return data;
    },
  });
}

export function useFeeDetail(id: string) {
  return useQuery({
    queryKey: FINANCE_QUERY_KEYS.feeDetail(id),
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/finance/fees/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateFee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fee: Record<string, unknown>) => {
      const { data } = await axios.post("/api/admin/finance/fees", fee);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["finance"] }),
  });
}

// ============================================
// Invoices
// ============================================

export function useInvoices(params?: PaginationParams) {
  return useQuery({
    queryKey: FINANCE_QUERY_KEYS.invoices(params),
    queryFn: async () => {
      const { data } = await axios.get("/api/finance/invoices");
      return data;
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoice: Record<string, unknown>) => {
      const { data } = await axios.post("/api/finance/invoices", invoice);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["finance"] }),
  });
}

// ============================================
// Payments
// ============================================

export function usePayments(params?: PaginationParams & { status?: string }) {
  return useQuery({
    queryKey: FINANCE_QUERY_KEYS.payments(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.status) searchParams.set("status", params.status);
      const { data } = await axios.get(
        `/api/admin/finance/payments?${searchParams.toString()}`,
      );
      return data;
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payment: Record<string, unknown>) => {
      const { data } = await axios.post("/api/admin/finance/payments", payment);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["finance"] }),
  });
}
