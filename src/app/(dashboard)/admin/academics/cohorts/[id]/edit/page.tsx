import { ChevronRight, Layers } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/prisma";
import { CohortForm } from "../../../_components/AcademicForms";

export default async function EditCohortPage({
  params,
}: {
  params: { id: string };
}) {
  const [cohort, programs] = await Promise.all([
    db.cohort.findUnique({ where: { id: params.id } }),
    db.program.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!cohort) {
    notFound();
  }

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
          <span className="text-slate-900 dark:text-white">Edit Cohort</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">
              Edit Cohort
            </h1>
            <p className="text-slate-500 font-medium">
              Update details for {cohort.name}.
            </p>
          </div>
        </div>
      </div>

      <CohortForm initialData={cohort} programs={programs} />
    </div>
  );
}
