import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import db from "@/lib/prisma";
import { ProgramForm } from "../../_components/AcademicForms";

export default async function NewProgramPage() {
  const departments = await db.department.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

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
          <span className="text-slate-900 dark:text-white">New Program</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">
              Create Program
            </h1>
            <p className="text-slate-500 font-medium">
              Add a new degree track or certification program.
            </p>
          </div>
        </div>
      </div>

      <ProgramForm departments={departments} />
    </div>
  );
}
