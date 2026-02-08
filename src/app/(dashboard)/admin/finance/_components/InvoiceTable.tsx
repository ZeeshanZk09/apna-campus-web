// src/app/admin/finance/_components/InvoiceTable.tsx
"use client";

import { CheckCircle, Clock, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { collectPaymentAction } from "@/app/actions/finance";

interface InvoiceTableProps {
  initialInvoices: any[];
}

export default function InvoiceTable({ initialInvoices }: InvoiceTableProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCollect = async (id: string) => {
    if (!confirm("Confirm payment collection for this invoice?")) return;

    setLoadingId(id);
    const res = await collectPaymentAction(id);
    setLoadingId(null);

    if (res.success) {
      toast.success(res.message);
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: "PAID" } : inv)),
      );
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-bold">Subscription & Fee History</h3>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            placeholder="Search by student or ID..."
            className="pl-10 pr-4 py-2 bg-muted/50 border-none rounded-xl text-sm focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted/30 text-[10px] uppercase text-muted-foreground font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Invoice ID</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 font-mono text-[10px] text-primary">
                  #{inv.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold">{inv.student.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {inv.student.email}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-black">
                  PKR {inv.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      inv.status === "PAID"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {inv.status !== "PAID" ? (
                    <button
                      onClick={() => handleCollect(inv.id)}
                      disabled={loadingId === inv.id}
                      className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
                    >
                      {loadingId === inv.id ? "..." : "Mark Paid"}
                    </button>
                  ) : (
                    <div className="flex justify-end pr-2">
                      <CheckCircle size={18} className="text-green-500" />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
