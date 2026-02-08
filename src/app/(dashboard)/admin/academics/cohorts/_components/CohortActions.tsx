"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteCohortAction } from "@/app/actions/academics";

export function CohortActions({ id, name }: { id: string; name: string }) {
  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete the cohort "${name}"? This action cannot be undone.`,
      )
    ) {
      try {
        const res = await deleteCohortAction(id);
        if (res.success) {
          toast.success("Cohort deleted successfully");
        } else {
          toast.error(res.error || "Failed to delete cohort");
        }
      } catch (_err) {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link
        href={`/admin/academics/cohorts/${id}/edit`}
        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
      >
        <Pencil size={16} />
      </Link>
      <button
        onClick={handleDelete}
        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
