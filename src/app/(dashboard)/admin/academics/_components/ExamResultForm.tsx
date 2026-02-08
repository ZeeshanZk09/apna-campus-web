"use client";

import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
// import { recordExamResultAction } from '@/app/actions/assessments';
import { toast } from "react-hot-toast";
import { recordExamResultAction } from "@/app/actions/assignments";
import { GradeScale } from "@/app/generated/prisma/enums";

interface ExamResultFormProps {
  examId: string;
  enrollmentId: string;
  initialMarks?: number;
  initialGrade?: GradeScale;
  initialRemarks?: string;
  maxMarks: number;
}

export default function ExamResultForm({
  examId,
  enrollmentId,
  initialMarks,
  initialGrade,
  initialRemarks,
  maxMarks,
}: ExamResultFormProps) {
  const [marks, setMarks] = useState(initialMarks?.toString() || "");
  const [grade, setGrade] = useState<GradeScale | "">(initialGrade || "");
  const [remarks, setRemarks] = useState(initialRemarks || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await recordExamResultAction({
        examId,
        enrollmentId,
        marks: marks ? Number(marks) : undefined,
        grade: grade ? (grade as GradeScale) : undefined,
        remarks,
      });
      if (res.success) {
        toast.success("Result saved");
      } else {
        toast.error(res.error || "Failed to save");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative group">
        <input
          type="number"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          placeholder="Marks"
          className="w-20 bg-muted/50 border-none rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
        />
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Max: {maxMarks}
        </span>
      </div>

      <select
        value={grade}
        onChange={(e) => setGrade(e.target.value as GradeScale)}
        className="w-16 bg-muted/50 border-none rounded-xl px-2 py-2 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all appearance-none cursor-pointer"
      >
        <option value="">-</option>
        {Object.values(GradeScale).map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      <input
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Remarks..."
        className="bg-muted/50 border-none rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-orange-500 transition-all flex-1"
      />

      <button
        onClick={handleSave}
        disabled={isSubmitting}
        className="p-2.5 bg-orange-500 text-white rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
      >
        {isSubmitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Check size={16} />
        )}
      </button>
    </div>
  );
}
