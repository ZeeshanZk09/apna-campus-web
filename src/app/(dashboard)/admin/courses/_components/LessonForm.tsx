// src/app/admin/courses/_components/LessonForm.tsx
"use client";

import { Loader2, Plus, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { createLessonAction } from "@/app/actions/course";

export default function LessonForm({ subjectId }: { subjectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("subjectId", subjectId);

    try {
      const result = await createLessonAction(formData);
      if (result.success) {
        toast.success("Lesson added");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to add lesson");
      }
    } catch (_err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
      >
        <Plus size={14} /> Add Lesson
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm animate-in fade-in zoom-in duration-200"
    >
      <input
        name="title"
        placeholder="Lesson Title..."
        className="bg-transparent text-xs font-bold px-3 py-1.5 focus:outline-none dark:text-white min-w-[150px]"
        required
      />
      <input
        name="order"
        type="number"
        placeholder="#"
        className="w-12 bg-gray-50 dark:bg-gray-900 text-xs text-center py-1.5 rounded-lg focus:outline-none dark:text-gray-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Plus size={14} />
        )}
      </button>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="p-1.5 text-gray-400 hover:text-red-500"
      >
        <X size={14} />
      </button>
    </form>
  );
}
