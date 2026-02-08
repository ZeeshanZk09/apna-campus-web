import { ChevronRight, Layers } from "lucide-react";
import Link from "next/link";
import db from "@/lib/prisma";
import { CohortForm } from "../../_components/AcademicForms";

export default async function NewCohortPage() {
  const programs = await db.program.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link
            href="/admin/academics/cohorts"
            className="hover:text-blue-500 transition-colors"
          >
            Cohorts
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 dark:text-white">New Cohort</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">
              Create Cohort
            </h1>
            <p className="text-slate-500 font-medium">
              Add a new student batch or section.
            </p>
          </div>
        </div>
      </div>

      <CohortForm programs={programs} />
    </div>
  );
}
