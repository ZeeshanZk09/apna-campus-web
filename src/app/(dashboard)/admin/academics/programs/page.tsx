import { BookOpen, Clock, Plus } from "lucide-react";
import Link from "next/link";
import db from "@/lib/prisma";
import { ProgramActions } from "./_components/ProgramActions";

export default async function ProgramsPage() {
  const programs = await db.program.findMany({
    include: {
      department: true,
      _count: {
        select: { courses: true, cohorts: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white">
            Programs
          </h2>
          <p className="text-slate-500 text-sm">
            Manage academic programs and degree tracks.
          </p>
        </div>
        <Link
          href="/admin/academics/programs/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all"
        >
          <Plus size={18} />
          Add Program
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <BookOpen size={24} />
              </div>
              <ProgramActions id={prog.id} name={prog.name} />
            </div>

            <h3 className="text-lg font-black dark:text-white mb-1">
              {prog.name}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {prog.code || "NO CODE"}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-bold text-blue-500 uppercase">
                {prog.department?.name || "No Dept"}
              </span>
            </div>

            <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">
              {prog.description || "No description provided for this program."}
            </p>

            <div className="flex border-t border-slate-100 dark:border-slate-800 pt-4 gap-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Duration
                </p>
                <p className="text-sm font-black dark:text-white flex items-center gap-1">
                  <Clock size={12} />
                  {prog.durationMonths}m
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Courses
                </p>
                <p className="text-sm font-black dark:text-white">
                  {prog._count.courses}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Cohorts
                </p>
                <p className="text-sm font-black dark:text-white">
                  {prog._count.cohorts}
                </p>
              </div>
            </div>
          </div>
        ))}

        {programs.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <BookOpen size={32} />
            </div>
            <p className="font-bold dark:text-white">No programs found</p>
            <p className="text-sm text-slate-500 max-w-xs mt-1">
              Start by adding your first academic program.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
