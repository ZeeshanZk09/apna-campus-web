// src/app/admin/enrollments/page.tsx

import { Inbox, UserPlus } from "lucide-react";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import { getAllCohorts } from "@/lib/queries/enrollmentQueries";
import { getUsersByRole } from "@/lib/queries/userManagement";
import EnrollmentForm from "./_components/EnrollmentForm";

export const dynamic = "force-dynamic";

export default async function EnrollmentsPage() {
  const [cohorts, students] = await Promise.all([
    getAllCohorts(),
    getUsersByRole("STUDENT"),
  ]);

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Student Enrollments
            </h1>
            <p className="text-gray-500 mt-2">
              Manage which students are assigned to which academic batches.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Enrollment Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <EnrollmentForm cohorts={cohorts} students={students} />
            </div>
          </div>

          {/* Current Enrollments Table */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-50 dark:border-gray-700">
                <h3 className="text-lg font-bold dark:text-white">
                  Active Enrollments
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-400 font-bold">
                    <tr>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Cohort / Batch</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {cohorts.flatMap((c) => c.enrollments).length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <Inbox
                            size={40}
                            className="mx-auto mb-2 opacity-20"
                          />
                          No enrollments found.
                        </td>
                      </tr>
                    ) : (
                      cohorts
                        .flatMap((c) =>
                          c.enrollments.map((e) => ({
                            ...e,
                            cohortName: c.name,
                          })),
                        )
                        .map((enrollment) => (
                          <tr
                            key={enrollment.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                  {enrollment.user.username.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-sm dark:text-white">
                                    {enrollment.user.username}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {enrollment.user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {enrollment.cohortName}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                {enrollment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-gray-400 hover:text-red-500 transition-colors">
                                <UserPlus size={18} />
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
