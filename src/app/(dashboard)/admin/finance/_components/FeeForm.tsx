"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createFeeAction } from "@/app/actions/finance";
import { FeeType } from "@/app/generated/prisma/enums";

const feeTypeValues = Object.values(FeeType) as [string, ...string[]];

const feeSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  type: z.enum(feeTypeValues) as z.ZodType<FeeType>,
  dueDate: z.string().optional(),
});

type FeeFormValues = z.infer<typeof feeSchema>;

export default function FeeForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeeFormValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      type: "TUITION",
    },
  });

  const onSubmit = async (data: FeeFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createFeeAction({
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      });

      if (result.success) {
        toast.success(result.message);
        reset();
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-2xl hover:bg-black hover:text-white transition-all group"
      >
        <Plus size={20} className="text-black group-hover:text-white" />
        <span className="text-[10px] font-black uppercase">Fee Type</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black text-white rounded-xl">
                  <CreditCard size={20} />
                </div>
                <h3 className="text-xl font-black">Define Fee Structure</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Fee Title
                  </label>
                  <input
                    {...register("title")}
                    placeholder="e.g. Annual Tuition Fee 2024"
                    className="w-full px-6 py-4 bg-muted/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                  />
                  {errors.title && (
                    <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tighter">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Amount ($)
                  </label>
                  <input
                    {...register("amount")}
                    type="number"
                    placeholder="0.00"
                    className="w-full px-6 py-4 bg-muted/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                  />
                  {errors.amount && (
                    <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tighter">
                      {errors.amount?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Fee Category
                  </label>
                  <select
                    {...register("type")}
                    className="w-full px-6 py-4 bg-muted/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all appearance-none"
                  >
                    {Object.entries(FeeType).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key.charAt(0) +
                          key.slice(1).toLowerCase().replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
                    Default Due Date (Optional)
                  </label>
                  <input
                    {...register("dueDate")}
                    type="date"
                    className="w-full px-6 py-4 bg-muted/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-8 py-4 bg-muted text-muted-foreground rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-3 px-8 py-4 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black/90 transition-all flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>Save Fee Structure</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
