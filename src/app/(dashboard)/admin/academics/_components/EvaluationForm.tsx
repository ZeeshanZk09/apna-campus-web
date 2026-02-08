"use client";

import { useForm } from "@tanstack/react-form";
import { Award, Check, MessageSquare, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { gradeAssignmentAction } from "@/app/actions/assessments";

interface EvaluationFormProps {
  assignmentId: string;
  studentId: string;
  existingMarks?: number;
  existingFeedback?: string;
}

export default function EvaluationForm({
  assignmentId,
  studentId,
  existingMarks,
  existingFeedback,
}: EvaluationFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      marks: existingMarks || 0,
      feedback: existingFeedback || "",
    },
    onSubmit: async ({ value }) => {
      const res = await gradeAssignmentAction(
        assignmentId,
        studentId,
        Number(value.marks),
        value.feedback,
      );
      if (res.success) {
        toast.success("Graded successfully!");
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to grade");
      }
    },
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${existingMarks !== undefined ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white" : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"}`}
      >
        <Award size={14} />
        {existingMarks !== undefined
          ? `Update Grade (${existingMarks})`
          : "Grade Now"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                    <Award size={20} />
                  </div>
                  <h2 className="text-2xl font-black">Grade Submission</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-6"
              >
                <form.Field
                  name="marks"
                  validators={{ onChange: z.number().min(0).max(100) }}
                  children={(field) => (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Marks (0-100)
                      </label>
                      <input
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                        className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary transition-all"
                      />
                      {field.state.meta.errors && (
                        <p className="text-[10px] font-bold text-destructive ml-1">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                />

                <form.Field
                  name="feedback"
                  children={(field) => (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Feedback
                      </label>
                      <textarea
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        rows={4}
                        className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary transition-all resize-none placeholder:font-medium"
                        placeholder="Provide feedback to the student..."
                      />
                    </div>
                  )}
                />

                <div className="pt-4 text-center">
                  <p className="text-[10px] text-muted-foreground font-medium mb-4 flex items-center justify-center gap-2">
                    <MessageSquare size={12} /> Student will be notified of
                    their grade.
                  </p>
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                      <button
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Check size={18} />
                        )}
                        Save Evaluation
                      </button>
                    )}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
