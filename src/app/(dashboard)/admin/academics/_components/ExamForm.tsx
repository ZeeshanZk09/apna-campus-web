"use client";

import { useForm } from "@tanstack/react-form";
import { Plus, Save, Trophy, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { createExamAction } from '@/app/actions/assessments';
import { toast } from "react-hot-toast";
import { z } from "zod";
import { createExamAction } from "@/app/actions/assignments";
import { ExamType } from "@/app/generated/prisma/enums";

interface ExamFormProps {
  courses: any[];
}

export default function ExamForm({ courses }: ExamFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: "",
      type: ExamType.FINAL,
      courseId: courses[0]?.id || "",
      maxMarks: 100,
      passingMarks: 40,
      date: "",
    },
    onSubmit: async ({ value }) => {
      const res = await createExamAction({
        ...value,
        date: value.date ? new Date(value.date) : new Date(),
      });
      if (res.success) {
        toast.success("Exam scheduled!");
        setIsOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to schedule exam");
      }
    },
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <Plus size={18} />
        New Exam
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                    <Trophy size={20} />
                  </div>
                  <h2 className="text-2xl font-black">Schedule Exam</h2>
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
                <div className="grid grid-cols-2 gap-4">
                  <form.Field
                    name="title"
                    validators={{ onChange: z.string().min(3) }}
                    children={(field) => (
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Exam Title
                        </label>
                        <input
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                          placeholder="e.g. Midterm Spring 2024"
                        />
                      </div>
                    )}
                  />

                  <form.Field
                    name="courseId"
                    children={(field) => (
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Course
                        </label>
                        <select
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-orange-500 transition-all appearance-none"
                        >
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />

                  <form.Field
                    name="type"
                    children={(field) => (
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Type
                        </label>
                        <select
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value as any)
                          }
                          className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                        >
                          {Object.values(ExamType).map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />

                  <form.Field
                    name="date"
                    children={(field) => (
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                      </div>
                    )}
                  />

                  <form.Field
                    name="maxMarks"
                    children={(field) => (
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Max Marks
                        </label>
                        <input
                          type="number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                      </div>
                    )}
                  />

                  <form.Field
                    name="passingMarks"
                    children={(field) => (
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Passing Marks
                        </label>
                        <input
                          type="number"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="pt-4">
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                      <button
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}
                        Schedule Exam
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
