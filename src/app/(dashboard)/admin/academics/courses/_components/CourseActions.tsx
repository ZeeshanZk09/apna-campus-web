"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteCourseAction } from "@/app/actions/academics";

export function CourseActions({ id, name }: { id: string; name: string }) {
  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete the course "${name}"? This action cannot be undone.`,
      )
    ) {
      try {
        const res = await deleteCourseAction(id);
        if (res.success) {
          toast.success("Course deleted successfully");
        } else {
          toast.error(res.error || "Failed to delete course");
        }
      } catch (_err) {
        toast.error("An error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link
        href={`/admin/academics/courses/${id}`}
        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
      >
        <Eye size={16} />
      </Link>
      <Link
        href={`/admin/academics/courses/${id}/edit`}
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
