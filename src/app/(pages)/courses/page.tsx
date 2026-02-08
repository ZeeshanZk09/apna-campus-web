import {
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { getAllCourses } from "@/lib/queries/academicQueries";

export const dynamic = "force-dynamic";

export default async function CoursesPage(_props) {
  const courses = await getAllCourses();

  const departments = [
    ...new Set(
      courses
        .map((c) => c.department?.name)
        .filter((name): name is string => Boolean(name)),
    ),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {/* ── Header ── */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
          <GraduationCap size={16} />
          <span>
            {courses.length} Course{courses.length !== 1 ? "s" : ""} Available
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Explore Our{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Courses
          </span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Find the perfect course to advance your skills and accelerate your
          career growth.
        </p>
      </div>

      {/* ── Department Tags ── */}
      {departments.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <span className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full">
            All Courses
          </span>
          {departments.map((dept) => (
            <span
              key={dept}
              className="px-4 py-2 bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-colors"
            >
              {dept}
            </span>
          ))}
        </div>
      )}

      {/* ── Course Grid ── */}
      {courses.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
          <BookOpen
            size={48}
            className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
          />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No courses available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            We&apos;re preparing new courses. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 text-xs font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full uppercase tracking-wide">
                    {course.code}
                  </span>
                  {course.creditHours && (
                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={14} />
                      {course.creditHours} Credits
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-6 pt-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed mb-4 min-h-[3.75rem]">
                  {course.description ||
                    "Discover in-depth knowledge and practical skills in this comprehensive course."}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {course.program && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      <GraduationCap size={12} />
                      {course.program.name}
                    </span>
                  )}
                  {course.department && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      <Layers size={12} />
                      {course.department.name}
                    </span>
                  )}
                  {course.subjects && course.subjects.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      <BookOpen size={12} />
                      {course.subjects.length} Subject
                      {course.subjects.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={`/courses/${course.code}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all text-sm group-hover:shadow-lg group-hover:shadow-indigo-500/25"
                >
                  View Course <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
