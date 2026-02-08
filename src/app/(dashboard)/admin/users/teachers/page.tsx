import { GraduationCap, UserPlus } from "lucide-react";
import Link from "next/link";
import { getAllTeachers } from "@/lib/queries/teacherQueries";
import TeacherList from "../_components/TeacherList";

export default async function TeachersPage() {
  const teachers = await getAllTeachers();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-600 rounded-2xl">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              Faculty Management
            </h1>
          </div>
          <p className="text-muted-foreground font-medium">
            Oversee teaching staff, manage assignments, and monitor performance.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/users/new?role=TEACHER"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            <UserPlus size={18} /> Add New Faculty
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-3xl border border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            Total Faculty
          </p>
          <h4 className="text-2xl font-black">{teachers.length}</h4>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            Active Now
          </p>
          <h4 className="text-2xl font-black text-emerald-500">
            {teachers.filter((t) => !t.isBlocked).length}
          </h4>
        </div>
        {/* Add more summary stats if needed */}
      </div>

      <TeacherList teachers={teachers as any} />
    </div>
  );
}
