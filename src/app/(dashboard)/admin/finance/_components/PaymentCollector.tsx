"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { collectPaymentAction } from "@/app/actions/finance";

export default function PaymentCollector({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (currentStatus === "PAID") return null;

  const handleCollect = async () => {
    if (!confirm("Confirm payment collection for this invoice?")) return;

    setIsSubmitting(true);
    try {
      const result = await collectPaymentAction(invoiceId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (_error) {
      toast.error("Failed to collect payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      onClick={handleCollect}
      disabled={isSubmitting}
      className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all group"
      title="Mark as Paid"
    >
      {isSubmitting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <CreditCard size={18} />
      )}
    </button>
  );
}
