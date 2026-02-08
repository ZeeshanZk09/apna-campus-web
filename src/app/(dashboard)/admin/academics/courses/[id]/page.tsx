import {
  BookOpen,
  Edit3,
  FileText,
  Layers,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/queries/academicQueries";
import CourseTabs from "./_components/CourseTabs";

export default async function CourseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const course = await getCourseById(params.id);

  if (!course) notFound();

  const curriculumContent = (
    <div className="space-y-8">
      {course.subjects.map((subject) => (
        <div
          key={subject.id}
          className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
        >
          <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-800">
                <Layers size={20} className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {subject.title}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {subject.code || "NO-CODE"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/academics/subjects/${subject.id}/edit`}
                className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Edit3 size={16} className="text-slate-400" />
              </Link>
              <Link
                href={`/admin/academics/subjects/${subject.id}/lessons/new`}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                <Plus size={14} /> Lesson
              </Link>
            </div>
          </div>

          <div className="p-2">
            {subject.lessons.length > 0 ? (
              <div className="space-y-1">
                {subject.lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-6 text-xs font-black text-slate-300 group-hover:text-blue-300">
                          {idx + 1}
                        </span>
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                          <FileText size={14} className="text-slate-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white dark:hover:bg-slate-900 rounded-lg text-slate-400 hover:text-blue-500">
                          <Edit3 size={14} />
                        </button>
                        <button className="p-2 hover:bg-white dark:hover:bg-slate-900 rounded-lg text-slate-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  No lessons added yet
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      {course.subjects.length === 0 && (
        <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
          <Layers
            size={48}
            className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
          />
          <h3 className="font-black text-slate-400 text-xl">
            Curriculum is Empty
          </h3>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Start by adding your first subject to this course.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 relative overflow-hidden shadow-2xl shadow-primary/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
                <BookOpen size={28} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  {course.code}
                </p>
                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
                  {course.title}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                {course.creditHours} Credits
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                {course.department?.name}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/admin/academics/courses/${course.id}/edit`}
              className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-2xl transition-all"
            >
              <Settings size={20} className="text-slate-600" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar/Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
              <Layers size={20} className="text-blue-500" />
              Course Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-sm font-bold text-slate-500">
                  Subjects
                </span>
                <span className="text-lg font-black text-blue-600">
                  {course.subjects.length}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-sm font-bold text-slate-500">
                  Assignments
                </span>
                <span className="text-lg font-black text-amber-600">
                  {course.assignments.length}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-sm font-bold text-slate-500">
                  Active Exams
                </span>
                <span className="text-lg font-black text-emerald-600">
                  {course.exams.length}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <Link
                href={`/admin/academics/courses/${course.id}/subjects/new`}
                className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus size={18} /> Add New Subject
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic Tabs Content */}
        <CourseTabs course={course} curriculumContent={curriculumContent} />
      </div>
    </div>
  );
}
