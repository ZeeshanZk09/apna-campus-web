import { FileDown, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { getAllStudents } from "@/lib/queries/studentQueries";
import StudentList from "../_components/StudentList";

export default async function StudentsPage() {
  const students = await getAllStudents();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-2xl">
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">
              Student Registry
            </h1>
          </div>
          <p className="text-muted-foreground font-medium">
            Manage student enrollments, academic records, and general
            information.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-2xl text-sm font-bold hover:bg-secondary/80 transition-all border border-border">
            <FileDown size={18} /> Export List
          </button>
          <Link
            href="/admin/users/new?role=STUDENT"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <UserPlus size={18} /> Register Student
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-3xl border border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            Total Registered
          </p>
          <h4 className="text-2xl font-black">{students.length}</h4>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            Active Students
          </p>
          <h4 className="text-2xl font-black text-emerald-500">
            {students.filter((s) => !s.isBlocked).length}
          </h4>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            Unenrolled
          </p>
          <h4 className="text-2xl font-black text-orange-500">
            {students.filter((s) => s.enrollments.length === 0).length}
          </h4>
        </div>
      </div>

      <StudentList students={students as any} />
    </div>
  );
}
