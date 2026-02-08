// src/app/admin/enrollments/_components/EnrollmentForm.tsx
"use client";

import { CheckCircle2, Loader2, UserPlus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { enrollStudentAction } from "@/app/actions/enrollment";

interface EnrollmentFormProps {
  students: any[];
  cohorts: any[];
}

export default function EnrollmentForm({
  students,
  cohorts,
}: EnrollmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCohort, setSelectedCohort] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCohort) {
      toast.error("Please select both student and cohort");
      return;
    }

    setLoading(true);
    try {
      const result = await enrollStudentAction(selectedStudent, selectedCohort);
      if (result.success) {
        toast.success("Student enrolled successfully");
        setSelectedStudent("");
        setSelectedCohort("");
      } else {
        toast.error(result.error || "Failed to enroll student");
      }
    } catch (_err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
        <UserPlus size={22} className="text-indigo-500" /> New Enrollment
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Select Student
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            required
          >
            <option value="">-- Choose a student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.username} ({s.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Target Cohort / Batch
          </label>
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            required
          >
            <option value="">-- Choose a batch --</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.program?.name})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Enroll Student <CheckCircle2 size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
