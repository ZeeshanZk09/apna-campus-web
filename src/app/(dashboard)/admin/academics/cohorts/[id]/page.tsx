import {
  Calendar,
  Clock,
  GraduationCap,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCohortById } from "@/lib/queries/academicQueries";

export default async function CohortDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const cohort = await getCohortById(params.id);

  if (!cohort) notFound();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl shadow-primary/5 flex flex-col md:flex-row justify-between gap-8 items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl">
              <Users size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                {cohort.program?.name || "Academic Batch"}
              </p>
              <h1 className="text-3xl font-black tracking-tight uppercase">
                {cohort.name}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
              <Calendar size={14} /> Start:{" "}
              {new Date(cohort.startDate).toLocaleDateString()}
            </div>
            {cohort.endDate && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                <Clock size={14} /> End:{" "}
                {new Date(cohort.endDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/academics/enrollments/new?cohortId=${cohort.id}`}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <UserPlus size={18} /> Enroll Students
          </Link>
          <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats & Teachers */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-950/20 p-8 rounded-[32px] border border-indigo-100 dark:border-indigo-900/50">
            <h3 className="font-black text-xl mb-6 text-indigo-900 dark:text-indigo-400">
              Batch Health
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Students
                </p>
                <h4 className="text-2xl font-black">
                  {cohort.enrollments.length}
                </h4>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Teachers
                </p>
                <h4 className="text-2xl font-black">
                  {cohort.teacherCohorts.length}
                </h4>
              </div>
            </div>
          </div>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xl flex items-center gap-2">
                <GraduationCap size={20} className="text-indigo-600" />
                Faculty
              </h3>
              <Link
                href={`/admin/users/teachers?cohortId=${cohort.id}`}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {cohort.teacherCohorts.map((tc) => (
                <div
                  key={tc.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    {tc.teacher.username[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{tc.teacher.username}</p>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      {tc.role || "Lecturer"}
                    </p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {cohort.teacherCohorts.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-4">
                  No faculty assigned yet.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Student List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-xl">Student Roster</h3>
              <div className="relative">
                <input
                  placeholder="Search roster..."
                  className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold w-48"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={14}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Enrolled At</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cohort.enrollments.map((en) => (
                    <tr
                      key={en.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {en.user.username[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold">
                              {en.user.username}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {en.user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-full uppercase">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">
                        {new Date(en.enrolledAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-white rounded-lg text-slate-300 hover:text-indigo-600 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cohort.enrollments.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-20 text-center text-slate-400 italic text-sm font-medium"
                      >
                        Start by enrolling students into this batch.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
