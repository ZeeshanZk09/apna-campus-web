// src/app/admin/courses/_components/SubjectForm.tsx
"use client";

import { Layers, Loader2, Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { createSubjectAction } from "@/app/actions/course";

export default function SubjectForm({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("courseId", courseId);

    try {
      const result = await createSubjectAction(formData);
      if (result.success) {
        toast.success("Subject added");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.error || "Failed to add subject");
      }
    } catch (_err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white">
        <Layers size={20} className="text-indigo-500" /> Add Subject/Module
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
            Subject Title
          </label>
          <input
            name="title"
            placeholder="e.g. Introduction to Algebra"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
            Optional Code
          </label>
          <input
            name="code"
            placeholder="SUBJ-001"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 mt-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <span>
              Add Subject <Plus size={16} className="inline ml-1" />
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
