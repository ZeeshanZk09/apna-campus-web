import {
  ArrowUpRight,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { getAllFees, getAllInvoices } from "@/lib/queries/financeQueries";
import FeeForm from "./_components/FeeForm";
import PaymentCollector from "./_components/PaymentCollector";

export default async function FinanceDashboard() {
  const invoices = (await getAllInvoices()) as any[];
  const fees = await getAllFees();

  const totalRevenue = invoices
    .filter((i) => i.status === "PAID")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingRevenue = invoices
    .filter((i) => i.status === "PENDING")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 p-8">
      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 bg-black text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">
            Total Revenue
          </p>
          <h2 className="text-4xl font-black mb-4">
            ${totalRevenue.toLocaleString()}
          </h2>
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
            <ArrowUpRight size={14} /> Tracking all paid invoices
          </div>
        </div>

        <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
            Pending Dues
          </p>
          <h2 className="text-4xl font-black mb-4">
            ${pendingRevenue.toLocaleString()}
          </h2>
          <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-wider">
            <Clock size={14} /> Requires Follow-up
          </div>
        </div>

        <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
              Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/finance/invoices/new"
                className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-2xl hover:bg-primary hover:text-white transition-all group"
              >
                <FileText
                  size={20}
                  className="text-primary group-hover:text-white"
                />
                <span className="text-[10px] font-black uppercase">
                  Invoice
                </span>
              </Link>
              <FeeForm />
            </div>
          </div>
        </div>

        <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Fee Types
            </p>
            <div className="flex flex-wrap gap-2">
              {fees.map((fee) => (
                <span
                  key={fee.id}
                  className="px-3 py-1 bg-muted rounded-full text-[10px] font-black uppercase tracking-wider"
                >
                  {fee.title}
                </span>
              ))}
              {fees.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  No fees defined
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Invoices Table */}
      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Recent Invoices
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Monitoring payment statuses and student financial records.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search invoices..."
                className="pl-12 pr-6 py-3 bg-muted/50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary transition-all w-[300px]"
              />
            </div>
            <button className="p-3 bg-muted rounded-2xl hover:bg-border transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <tr>
                <Th className="px-8 py-4">Transaction ID</Th>
                <Th className="px-8 py-4">Student</Th>
                <Th className="px-8 py-4">Fee Item</Th>
                <Th className="px-8 py-4">Amount</Th>
                <Th className="px-8 py-4">Status</Th>
                <Th className="px-8 py-4 text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-muted-foreground uppercase">
                      {invoice.invoiceNo}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm">
                        {(invoice.enrollment as any)?.user?.name?.[0] || "S"}
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {(invoice.enrollment as any)?.user?.name || "Unknown"}
                        </p>
                        <p className="text-[10px] text-muted-foreground opacity-70">
                          {(invoice.enrollment as any)?.cohort?.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold">
                      {(invoice as any).fee?.title || "General Fee"}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {(invoice as any).fee?.type}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-lg font-black">
                      ${invoice.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        invoice.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : invoice.status === "PENDING"
                            ? "bg-orange-500/10 text-orange-600"
                            : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <PaymentCollector
                        invoiceId={invoice.id}
                        currentStatus={invoice.status}
                      />
                      <button className="p-3 hover:bg-muted rounded-2xl transition-colors text-muted-foreground">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CreditCard
                        className="text-muted-foreground opacity-20 mb-2"
                        size={48}
                      />
                      <p className="text-muted-foreground font-medium">
                        No financial transactions recorded.
                      </p>
                      <Link
                        href="/admin/finance/invoices/new"
                        className="text-primary text-xs font-black uppercase tracking-widest mt-2 hover:underline"
                      >
                        Generate First Invoice
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={className}>{children}</th>;
}
