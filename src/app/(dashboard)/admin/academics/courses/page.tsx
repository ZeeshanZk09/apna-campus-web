import { Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import db from "@/lib/prisma";
import { CourseActions } from "./_components/CourseActions";

export default async function CoursesAdminPage() {
  const courses = await db.course.findMany({
    include: {
      program: true,
      department: true,
      _count: {
        select: { subjects: true, assignments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white">
            Course Catalog
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Manage and organize all courses offered by the institute.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filter
          </button>
          <Link
            href="/admin/academics/courses/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all"
          >
            <Plus size={18} />
            Add Course
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search courses by name, code or department..."
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Course Code
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Course Title
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Program & Department
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Subjects
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-black">
                      {course.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black dark:text-white">
                      {course.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                      {course.creditHours} Credit Hours
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      {course.program?.name || "No Program"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {course.department?.name || "General"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      {course._count.subjects}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <CourseActions id={course.id} name={course.title} />
                  </td>
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-slate-500 font-medium">
                      No courses found in the catalog.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
