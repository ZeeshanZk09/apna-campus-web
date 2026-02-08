"use client";

import { useForm } from "@tanstack/react-form";
import { FileText, Plus, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { createAssignmentAction } from '@/app/actions/assessments';
import { toast } from "react-hot-toast";
import { z } from "zod";
import { createAssignmentAction } from "@/app/actions/assignments";

interface AssessmentFormProps {
  courses: any[];
}

export default function AssessmentForm({ courses }: AssessmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      courseId: courses[0]?.id || "",
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("title", value.title);
      formData.append("description", value.description);
      const res = await createAssignmentAction(formData, value.courseId);
      if (res.success) {
        toast.success("Assignment created!");
        setIsOpen(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to create assignment");
      }
    },
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <Plus size={18} />
        New Assignment
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
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-2xl font-black">Create Assignment</h2>
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
                  name="title"
                  validators={{
                    onChange: z.string().min(3, "Title is too short"),
                  }}
                  children={(field) => (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Title
                      </label>
                      <input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary transition-all placeholder:font-medium"
                        placeholder="e.g. Final Research Project"
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
                  name="courseId"
                  children={(field) => (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Course
                      </label>
                      <select
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                />

                <form.Field
                  name="description"
                  children={(field) => (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Description
                      </label>
                      <textarea
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        rows={4}
                        className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary transition-all resize-none placeholder:font-medium"
                        placeholder="Describe the assignment requirements..."
                      />
                    </div>
                  )}
                />

                <div className="pt-4">
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                      <button
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                        Publish Assignment
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
