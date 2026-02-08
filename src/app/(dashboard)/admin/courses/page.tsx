// src/app/admin/courses/page.tsx

import { Book, LayoutGrid, List, Plus } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import {
  getAllCourses,
  getAllDepartments,
  getAllPrograms,
} from "@/lib/queries/academicQueries";
import CourseForm from "./_components/CourseForm";

export const dynamic = "force-dynamic";

export default async function CoursesAdminPage() {
  const [courses, departments, programs] = await Promise.all([
    getAllCourses(),
    getAllDepartments(),
    getAllPrograms(),
  ]);

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Courses & Curriculum
            </h1>
            <p className="text-gray-500 mt-2">
              Design your educational programs and course structures.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Stats & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <div className="flex items-center gap-3 mb-4">
                <Book size={24} />
                <h3 className="font-bold">Summary</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-indigo-400 pb-2">
                  <span>Total Courses</span>
                  <span className="font-bold text-lg">{courses.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Active Programs</span>
                  <span className="font-bold text-lg">{programs.length}</span>
                </div>
              </div>
            </div>

            <CourseForm departments={departments} programs={programs} />
          </div>

          {/* Main: Courses List */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-bold dark:text-white">
                  Available Courses
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500">
                    <LayoutGrid size={18} />
                  </button>
                  <button className="p-2 text-gray-400">
                    <List size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {courses.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-gray-400">
                    <Book size={48} className="mx-auto mb-4 opacity-10" />
                    <p>No courses created yet.</p>
                  </div>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      className="group p-5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 hover:border-indigo-500 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm group-hover:bg-indigo-50 transition-colors">
                          <Book
                            size={20}
                            className="text-gray-400 group-hover:text-indigo-600"
                          />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                        {course.description || "No description provided."}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="text-[10px] text-gray-400 flex gap-3">
                          <span className="flex items-center gap-1 font-medium">
                            <LayoutGrid size={10} /> {course.subjects.length}{" "}
                            Subjects
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <Plus size={10} /> {course.creditHours} Credits
                          </span>
                        </div>
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="text-indigo-600 font-bold text-xs hover:underline"
                        >
                          Manage
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
