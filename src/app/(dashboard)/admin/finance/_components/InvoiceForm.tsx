"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, CreditCard, FileText, Loader2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createInvoiceAction } from "@/app/actions/finance";

const invoiceSchema = z.object({
  enrollmentId: z.string().min(1, "Student is required"),
  feeId: z.string().min(1, "Fee type is required"),
  amount: z.coerce.number().min(0),
  invoiceNo: z.string().min(1, "Invoice number is required"),
  dueDate: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  enrollments: any[];
  fees: any[];
}

export default function InvoiceForm({ enrollments, fees }: InvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
    },
  });

  const selectedFeeId = watch("feeId");

  // Auto-populate amount when fee is selected
  useEffect(() => {
    if (selectedFeeId) {
      const fee = fees.find((f) => f.id === selectedFeeId);
      if (fee) {
        setValue("amount", fee.amount);
      }
    }
  }, [selectedFeeId, fees, setValue]);

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    try {
      const result = await createInvoiceAction(formData);
      if (result.success) {
        toast.success(result.message);
        // Maybe redirect or reset
      } else {
        toast.error(result.message);
      }
    } catch (_error) {
      toast.error("Failed to generate invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-10 border-b border-border bg-black text-white flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">
              Generate Invoice
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Create a new billing record for a student
            </p>
          </div>
          <FileText size={48} className="opacity-20 translate-x-4 rotate-12" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Student Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-primary" />
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Select Student
                </label>
              </div>
              <select
                {...register("enrollmentId")}
                className="w-full px-6 py-5 bg-muted/50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-primary transition-all appearance-none"
              >
                <option value="">Choose enrollment...</option>
                {enrollments.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.user.name} ({e.cohort.name})
                  </option>
                ))}
              </select>
              {errors.enrollmentId && (
                <p className="text-[10px] text-red-500 font-bold uppercase ml-2 tracking-tighter">
                  {errors.enrollmentId.message}
                </p>
              )}
            </div>

            {/* Fee Type Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={16} className="text-primary" />
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Fee Structure
                </label>
              </div>
              <select
                {...register("feeId")}
                className="w-full px-6 py-5 bg-muted/50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-primary transition-all appearance-none"
              >
                <option value="">Select fee type...</option>
                {fees.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title} (${f.amount})
                  </option>
                ))}
              </select>
              {errors.feeId && (
                <p className="text-[10px] text-red-500 font-bold uppercase ml-2 tracking-tighter">
                  {errors.feeId.message}
                </p>
              )}
            </div>

            {/* Invoice Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-primary" />
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Invoice ID
                </label>
              </div>
              <input
                {...register("invoiceNo")}
                placeholder="INV-XXXXXX"
                className="w-full px-6 py-5 bg-muted/50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
              />
              {errors.invoiceNo && (
                <p className="text-[10px] text-red-500 font-bold uppercase ml-2 tracking-tighter">
                  {errors.invoiceNo.message}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-primary" />
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Due Date
                </label>
              </div>
              <input
                {...register("dueDate")}
                type="date"
                className="w-full px-6 py-5 bg-muted/50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="space-y-4 col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary font-black text-xs">$</span>
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Adjusted Final Amount
                </label>
              </div>
              <input
                {...register("amount")}
                type="number"
                placeholder="0.00"
                className="w-full px-8 py-6 bg-muted/30 border-2 border-dashed border-border rounded-[2rem] text-3xl font-black text-center focus:border-primary focus:ring-0 transition-all"
              />
              {errors.amount && (
                <p className="text-[10px] text-red-500 font-bold uppercase text-center tracking-tighter">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-10 flex gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-10 py-6 bg-muted text-muted-foreground rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-border transition-all"
            >
              Go Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-10 py-6 bg-black text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-black/90 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              {isSubmitting ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Generate & Send Invoice
                  <FileText
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
