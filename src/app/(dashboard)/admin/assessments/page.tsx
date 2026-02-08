// src/app/admin/assessments/page.tsx

import {
  CheckCircle,
  Clock,
  FileText,
  Plus,
  Search,
  Trophy,
} from "lucide-react";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import { getAllCourses } from "@/lib/queries/academicQueries";
import { getAllSubmissions } from "@/lib/queries/assessmentQueries";

export const dynamic = "force-dynamic";

export default async function AssessmentsPage() {
  const [submissions, _courses] = await Promise.all([
    getAllSubmissions(),
    getAllCourses(),
  ]);

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Assessments & Grading
            </h1>
            <p className="text-gray-500 mt-2">
              Manage assignments, exams, and student performance tracking.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none">
            <Plus size={20} /> Create New Test
          </button>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Pending Gradings",
              value: submissions.length,
              icon: Clock,
              color: "text-amber-500",
              bg: "bg-amber-50 dark:bg-amber-900/20",
            },
            {
              label: "Avg Score",
              value: "84%",
              icon: Trophy,
              color: "text-green-500",
              bg: "bg-green-50 dark:bg-green-900/20",
            },
            {
              label: "Active Assignments",
              value: "12",
              icon: FileText,
              color: "text-indigo-500",
              bg: "bg-indigo-50 dark:bg-indigo-900/20",
            },
            {
              label: "Completed Tests",
              value: "148",
              icon: CheckCircle,
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-900/20",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center text-center"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}
              >
                <stat.icon size={24} />
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {stat.label}
              </div>
              <div className="text-2xl font-black dark:text-white">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Submissions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-bold dark:text-white">
              Recent Submissions for Grading
            </h3>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder="Search submissions..."
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white w-full md:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-950/50 text-[10px] uppercase text-gray-400 font-bold tracking-widest">
                <tr>
                  <th className="px-6 py-4">Assignment / Course</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {submissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400 text-sm"
                    >
                      No submissions waiting for review.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm dark:text-white group-hover:text-indigo-600 transition-colors">
                          {sub.assignment.title}
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase font-medium">
                          {sub.assignment.course.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold dark:text-white">
                            {sub.student.username.charAt(0)}
                          </div>
                          <span className="text-xs font-medium dark:text-gray-300">
                            {sub.student.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 font-bold text-xs hover:underline bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                          Grade Now
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
