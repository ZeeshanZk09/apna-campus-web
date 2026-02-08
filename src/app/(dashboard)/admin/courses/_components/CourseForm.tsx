// src/app/admin/courses/_components/CourseForm.tsx
"use client";

import { Loader2, Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { createCourseAction } from "@/app/actions/course";

interface CourseFormProps {
  departments: any[];
  programs: any[];
}

export default function CourseForm({ departments, programs }: CourseFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await createCourseAction(formData);
      if (result.success) {
        toast.success("Course created successfully");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.error || "Failed to create course");
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
        <Plus size={20} className="text-indigo-500" /> Add New Course
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
            Course Title
          </label>
          <input
            name="title"
            placeholder="e.g. Advanced Mathematics"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
              Code
            </label>
            <input
              name="code"
              placeholder="MATH101"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
              Credits
            </label>
            <input
              name="creditHours"
              type="number"
              placeholder="3"
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
            Department
          </label>
          <select
            name="departmentId"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="">Select Dept (Optional)</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
            Program
          </label>
          <select
            name="programId"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="">Select Program (Optional)</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 mt-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Create Course"
          )}
        </button>
      </form>
    </div>
  );
}
