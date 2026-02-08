import { Building2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DepartmentForm } from "../../_components/AcademicForms";

export default function NewDepartmentPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link
            href="/admin/academics/departments"
            className="hover:text-blue-500 transition-colors"
          >
            Departments
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 dark:text-white">New Department</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">
              Create Department
            </h1>
            <p className="text-slate-500 font-medium">
              Add a new academic department to your institution.
            </p>
          </div>
        </div>
      </div>

      <DepartmentForm />
    </div>
  );
}
