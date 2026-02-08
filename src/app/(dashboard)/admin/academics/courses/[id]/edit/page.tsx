import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/prisma";
import { CourseForm } from "../../../_components/AcademicForms";

export default async function EditCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const [course, departments, programs] = await Promise.all([
    db.course.findUnique({ where: { id: params.id } }),
    db.department.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    db.program.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link
            href="/admin/academics/courses"
            className="hover:text-blue-500 transition-colors"
          >
            Courses
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 dark:text-white">Edit Course</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">
              Edit Course
            </h1>
            <p className="text-slate-500 font-medium">
              Update details for {course.title}.
            </p>
          </div>
        </div>
      </div>

      <CourseForm
        initialData={course}
        departments={departments}
        programs={programs}
      />
    </div>
  );
}
