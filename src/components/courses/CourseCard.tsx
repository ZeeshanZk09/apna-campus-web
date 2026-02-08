"use client";

import { Clock, GraduationCap } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  course: {
    id: string;
    code: string;
    title: string;
    description: string | null;
    creditHours: number | null;
    program?: { name: string } | null;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded uppercase">
            {course.code}
          </span>
          {course.program && (
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <GraduationCap size={16} />
              {course.program.name}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {course.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 min-h-[4.5rem]">
          {course.description || "No description available for this course."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Clock size={16} />
            <span className="text-sm">
              {course.creditHours || 0} Credit Hours
            </span>
          </div>
          <Link
            href={`/courses/${course.code}`}
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold text-sm"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
}
