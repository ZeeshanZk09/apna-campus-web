import { Building2, Plus } from "lucide-react";
import Link from "next/link";
import db from "@/lib/prisma";
import { DepartmentActions } from "./_components/DepartmentActions";

export default async function DepartmentsPage() {
  const departments = await db.department.findMany({
    include: {
      _count: {
        select: { programs: true, courses: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white">
            Departments
          </h2>
          <p className="text-slate-500 text-sm">
            Manage academic departments and their organization.
          </p>
        </div>
        <Link
          href="/admin/academics/departments/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:scale-[1.02] transition-all"
        >
          <Plus size={18} />
          Add Department
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Building2 size={24} />
              </div>
              <DepartmentActions id={dept.id} name={dept.name} />
            </div>

            <h3 className="text-lg font-black dark:text-white mb-1">
              {dept.name}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              {dept.code || "NO CODE"}
            </p>

            <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">
              {dept.description ||
                "No description provided for this department."}
            </p>

            <div className="flex border-t border-slate-100 dark:border-slate-800 pt-4 gap-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Programs
                </p>
                <p className="text-sm font-black dark:text-white">
                  {dept._count.programs}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Courses
                </p>
                <p className="text-sm font-black dark:text-white">
                  {dept._count.courses}
                </p>
              </div>
            </div>
          </div>
        ))}

        {departments.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Building2 size={32} />
            </div>
            <p className="font-bold dark:text-white">No departments found</p>
            <p className="text-sm text-slate-500 max-w-xs mt-1">
              Start by adding your first academic department to organize your
              campus.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
