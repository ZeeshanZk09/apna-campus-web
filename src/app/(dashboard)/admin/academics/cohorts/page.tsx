import { Calendar, Layers, Plus, Users } from "lucide-react";
import Link from "next/link";
import db from "@/lib/prisma";
import { CohortActions } from "./_components/CohortActions";

export default async function CohortsPage() {
  const cohorts = await db.cohort.findMany({
    include: {
      program: true,
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white">
            Cohorts
          </h2>
          <p className="text-slate-500 text-sm">
            Manage student batches and classroom groups.
          </p>
        </div>
        <Link
          href="/admin/academics/cohorts/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all"
        >
          <Plus size={18} />
          Add Cohort
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cohorts.map((cohort) => (
          <div
            key={cohort.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Layers size={24} />
              </div>
              <CohortActions id={cohort.id} name={cohort.name} />
            </div>

            <h3 className="text-lg font-black dark:text-white mb-1">
              {cohort.name}
            </h3>
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">
              {cohort.program?.name || "No Program"}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar size={14} />
                <span>
                  Starts: {new Date(cohort.startDate).toLocaleDateString()}
                </span>
              </div>
              {cohort.endDate && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={14} />
                  <span>
                    Ends: {new Date(cohort.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <span className="text-sm font-black dark:text-white">
                  {cohort._count.enrollments} Students
                </span>
              </div>
            </div>
          </div>
        ))}

        {cohorts.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Layers size={32} />
            </div>
            <p className="font-bold dark:text-white">No cohorts found</p>
            <p className="text-sm text-slate-500 max-w-xs mt-1">
              Start by adding your first student cohort.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
