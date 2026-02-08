import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/prisma";
import { getProgramById } from "@/lib/queries/academicQueries";
import { ProgramForm } from "../../../_components/AcademicForms";

export default async function EditProgramPage({
  params,
}: {
  params: { id: string };
}) {
  const [program, departments] = await Promise.all([
    getProgramById(params.id),
    db.department.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!program) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link
            href="/admin/academics/programs"
            className="hover:text-blue-500 transition-colors"
          >
            Programs
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 dark:text-white">Edit Program</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">
              Edit Program
            </h1>
            <p className="text-slate-500 font-medium">
              Update details for {program.name}.
            </p>
          </div>
        </div>
      </div>

      <ProgramForm initialData={program} departments={departments} />
    </div>
  );
}
