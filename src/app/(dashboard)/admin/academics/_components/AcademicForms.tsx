"use client";

import { useForm } from "@tanstack/react-form";
import {
  BookOpen,
  Building2,
  Clock,
  Code,
  FileText,
  Layers,
  Plus,
  Save,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  createCohortAction,
  createCourseAction,
  createDepartmentAction,
  createProgramAction,
  updateCohortAction,
  updateCourseAction,
  updateDepartmentAction,
  updateProgramAction,
} from "@/app/actions/academics";
import type { getProgramById } from "@/lib/queries/academicQueries";

// --- Department Form ---

const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").toUpperCase(),
  description: z.string(),
});

type DepartmentFormProps = {
  initialData?: {
    id: string;
    name: string;
    code: string | null;
    description: string | null;
  };
};

export function DepartmentForm({ initialData }: DepartmentFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      description: initialData?.description || "",
    },
    validators: {
      onChange: departmentSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("code", value.code);
      formData.append("description", value.description || "");

      try {
        const res = isEditing
          ? await updateDepartmentAction(initialData.id, formData)
          : await createDepartmentAction(formData);

        if (res.success) {
          toast.success(
            `Department ${isEditing ? "updated" : "created"} successfully`,
          );
          router.push("/admin/academics/departments");
          router.refresh();
        } else {
          toast.error(res.error || "Something went wrong");
        }
      } catch (_err) {
        toast.error("Failed to save department");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="name"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" />
                Department Name
              </label>
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="code"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Code size={16} className="text-blue-500" />
                Department Code
              </label>
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value.toUpperCase())
                }
                placeholder="e.g. CS"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
              />
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <form.Field
        name="description"
        children={(field) => (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText size={16} className="text-blue-500" />
              Description
            </label>
            <textarea
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Brief overview of the department..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>
        )}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <X size={18} />
          Cancel
        </button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isEditing ? "Update Department" : "Create Department"}
            </button>
          )}
        />
      </div>
    </form>
  );
}

// --- Program Form ---

const programSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").toUpperCase(),
  departmentId: z.string().min(1, "Department is required"),
  durationMonths: z.number().min(1, "Duration must be at least 1 month"),
  description: z.string(),
});

type getProgramByIdType = Awaited<ReturnType<typeof getProgramById>>;

type ProgramFormProps = {
  initialData?: getProgramByIdType;
  departments: { id: string; name: string }[];
};

export function ProgramForm({ initialData, departments }: ProgramFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      departmentId: initialData?.departmentId || "",
      durationMonths: initialData?.durationMonths || 48, // Default to 4 years
      description: initialData?.description || "",
    },
    validators: {
      onChange: programSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("code", value.code);
      formData.append("departmentId", value.departmentId);
      formData.append("durationMonths", value.durationMonths.toString());
      formData.append("description", value.description || "");

      try {
        const res = isEditing
          ? await updateProgramAction(initialData.id, formData)
          : await createProgramAction(formData);

        if (res.success) {
          toast.success(
            `Program ${isEditing ? "updated" : "created"} successfully`,
          );
          router.push("/admin/academics/programs");
          router.refresh();
        } else {
          toast.error(res.error || "Something went wrong");
        }
      } catch (_err) {
        toast.error("Failed to save program");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="name"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <BookOpen size={16} className="text-blue-500" />
                Program Name
              </label>
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. BS Computer Science"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="code"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Code size={16} className="text-blue-500" />
                Program Code
              </label>
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value.toUpperCase())
                }
                placeholder="e.g. BSCS"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
              />
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="departmentId"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" />
                Department
              </label>
              <select
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="durationMonths"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                Duration (Months)
              </label>
              <input
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(parseInt(e.target.value, 10))
                }
                placeholder="e.g. 48"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <form.Field
        name="description"
        children={(field) => (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText size={16} className="text-blue-500" />
              Description
            </label>
            <textarea
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Brief overview of the program..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>
        )}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <X size={18} />
          Cancel
        </button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isEditing ? "Update Program" : "Create Program"}
            </button>
          )}
        />
      </div>
    </form>
  );
}

// --- Course Form ---

const courseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").toUpperCase(),
  creditHours: z.number().min(0, "Credit hours must be at least 0"),
  departmentId: z.string().min(1, "Department is required"),
  programId: z.string(),
  description: z.string(),
});

type CourseFormProps = {
  initialData?: {
    id: string;
    code: string;
    programId: string | null;
    departmentId: string | null;
    title: string;
    description: string | null;
    creditHours: number | null;
    prerequisites: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  };
  departments: { id: string; name: string }[];
  programs: { id: string; name: string }[];
};

export function CourseForm({
  initialData,
  departments,
  programs,
}: CourseFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      code: initialData?.code || "",
      creditHours: initialData?.creditHours || 3,
      departmentId: initialData?.departmentId || "",
      programId: initialData?.programId || "",
      description: initialData?.description || "",
    },
    validators: {
      onChange: courseSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("title", value.title);
      formData.append("code", value.code);
      formData.append("creditHours", value.creditHours.toString());
      formData.append("departmentId", value.departmentId);
      formData.append("programId", value.programId || "");
      formData.append("description", value.description || "");

      try {
        const res = isEditing
          ? await updateCourseAction(initialData.id, formData)
          : await createCourseAction(formData);

        if (res.success) {
          toast.success(
            `Course ${isEditing ? "updated" : "created"} successfully`,
          );
          router.push("/admin/academics/courses");
          router.refresh();
        } else {
          toast.error(res.error || "Something went wrong");
        }
      } catch (_err) {
        toast.error("Failed to save course");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="title"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <BookOpen size={16} className="text-blue-500" />
                Course Title
              </label>
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Introduction to Programming"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="code"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Code size={16} className="text-blue-500" />
                Course Code
              </label>
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value.toUpperCase())
                }
                placeholder="e.g. CS101"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
              />
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="departmentId"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" />
                Department
              </label>
              <select
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        />

        <form.Field
          name="programId"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Layers size={16} className="text-blue-500" />
                Program (Optional)
              </label>
              <select
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Select Program</option>
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        />

        <form.Field
          name="creditHours"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                Credit Hours
              </label>
              <input
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(parseInt(e.target.value, 10))
                }
                placeholder="e.g. 3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          )}
        />
      </div>

      <form.Field
        name="description"
        children={(field) => (
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText size={16} className="text-blue-500" />
              Description
            </label>
            <textarea
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Brief overview of the course content..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>
        )}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <X size={18} />
          Cancel
        </button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isEditing ? "Update Course" : "Create Course"}
            </button>
          )}
        />
      </div>
    </form>
  );
}

// --- Cohort Form ---

const cohortSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
  programId: z.string().min(1, "Program is required"),
});

type CohortFormProps = {
  initialData?: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date | null;
    programId: string | null;
  };
  programs: { id: string; name: string }[];
};

export function CohortForm({ initialData, programs }: CohortFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : "",
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().split("T")[0]
        : "",
      programId: initialData?.programId || "",
    },
    validators: {
      onChange: cohortSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("startDate", value.startDate);
      if (value.endDate) formData.append("endDate", value.endDate);
      formData.append("programId", value.programId);

      try {
        const res = isEditing
          ? await updateCohortAction(initialData.id, formData)
          : await createCohortAction(formData);

        if (res.success) {
          toast.success(
            `Cohort ${isEditing ? "updated" : "created"} successfully`,
          );
          router.push("/admin/academics/cohorts");
          router.refresh();
        } else {
          toast.error(res.error || "Something went wrong");
        }
      } catch (_err) {
        toast.error("Failed to save cohort");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="name"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Layers size={16} className="text-blue-500" />
                Cohort Name
              </label>
              <input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. Batch 2025 - Section A"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="programId"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <BookOpen size={16} className="text-blue-500" />
                Program
              </label>
              <select
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Select Program</option>
                {programs.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        />

        <form.Field
          name="startDate"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                Start Date
              </label>
              <input
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          )}
        />

        <form.Field
          name="endDate"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                End Date (Optional)
              </label>
              <input
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <X size={18} />
          Cancel
        </button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isEditing ? "Update Cohort" : "Create Cohort"}
            </button>
          )}
        />
      </div>
    </form>
  );
}

// --- Subject Form ---

const subjectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  code: z.string(),
  description: z.string(),
});

type SubjectFormProps = {
  courseId: string;
  initialData?: {
    id: string;
    title: string;
    code: string | null;
    description: string | null;
  };
};

export function SubjectForm({ courseId, initialData }: SubjectFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;
  const {
    createSubjectAction,
    updateSubjectAction,
  } = require("@/app/actions/academics");

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      code: initialData?.code || "",
      description: initialData?.description || "",
    },
    validators: {
      onChange: subjectSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("title", value.title);
      formData.append("code", value.code || "");
      formData.append("courseId", courseId);
      formData.append("description", value.description || "");

      try {
        const res = isEditing
          ? await updateSubjectAction(initialData.id, formData)
          : await createSubjectAction(formData);

        if (res.success) {
          toast.success(
            `Subject ${isEditing ? "updated" : "created"} successfully`,
          );
          router.back();
        } else {
          toast.error(res.error || "Something went wrong");
        }
      } catch (_err) {
        toast.error("Failed to save subject");
      }
    },
  });

  return (
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
        children={(field) => (
          <div className="space-y-2">
            <label className="text-sm font-bold">Subject Title</label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none"
              placeholder="e.g. Introduction to Programming"
            />
          </div>
        )}
      />
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-xl border border-border"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-xl font-bold"
        >
          Save Subject
        </button>
      </div>
    </form>
  );
}

// --- Enrollment Form ---

const enrollmentSchema = z.object({
  userId: z.string().min(1, "Student is required"),
  cohortId: z.string().min(1, "Cohort is required"),
});

type EnrollmentFormProps = {
  students: { id: string; username: string; email: string }[];
  cohorts: { id: string; name: string }[];
  initialCohortId?: string;
};

export function EnrollmentForm({
  students,
  cohorts,
  initialCohortId,
}: EnrollmentFormProps) {
  const router = useRouter();
  const { enrollStudentAction } = require("@/app/actions/enrollment");

  const form = useForm({
    defaultValues: {
      userId: "",
      cohortId: initialCohortId || "",
    },
    validators: {
      onChange: enrollmentSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await enrollStudentAction(value.userId, value.cohortId);

        if (res.success) {
          toast.success("Student enrolled successfully");
          router.push(`/admin/academics/cohorts/${value.cohortId}`);
          router.refresh();
        } else {
          toast.error(res.error || "Something went wrong");
        }
      } catch (_err) {
        toast.error("Failed to enroll student");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form.Field
          name="userId"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Users size={16} className="text-blue-500" />
                Search Student
              </label>
              <select
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Select a Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.username} ({student.email})
                  </option>
                ))}
              </select>
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="cohortId"
          children={(field) => (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Layers size={16} className="text-blue-500" />
                Batch / Cohort
              </label>
              <select
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Select a Cohort</option>
                {cohorts.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.name}
                  </option>
                ))}
              </select>
              {field.state.meta.errors ? (
                <p className="text-xs text-red-500 font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <X size={18} />
          Cancel
        </button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              Confirm Enrollment
            </button>
          )}
        />
      </div>
    </form>
  );
}
