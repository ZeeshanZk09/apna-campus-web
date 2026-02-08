import { BookOpen, ChevronRight, GraduationCap, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDepartmentById } from "@/lib/queries/academicQueries";

export default async function DepartmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const department = await getDepartmentById(params.id);

  if (!department) notFound();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-card p-10 rounded-[40px] border border-border relative overflow-hidden shadow-2xl shadow-primary/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20">
                <GraduationCap size={28} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-primary">
                Department Profile
              </p>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
              {department.name}
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-2xl">
              {department.description ||
                "No description provided for this department."}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/admin/academics/departments/${department.id}/edit`}
              className="px-8 py-3.5 bg-secondary text-secondary-foreground rounded-2xl text-sm font-bold hover:bg-secondary/80 transition-all border border-border uppercase tracking-widest"
            >
              Edit Dept
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Statistics Columns */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10">
            <h3 className="font-black text-xl mb-6">Department KPIs</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-card p-6 rounded-2xl border border-primary/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Academic Programs
                </p>
                <h4 className="text-3xl font-black">
                  {department.programs.length}
                </h4>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-primary/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  Active Courses
                </p>
                <h4 className="text-3xl font-black">
                  {department.courses.length}
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-[32px] border border-border">
            <h3 className="font-black text-xl mb-6 uppercase tracking-tight">
              Quick Tools
            </h3>
            <div className="space-y-3">
              <Link
                href={`/admin/academics/programs/new?deptId=${department.id}`}
                className="w-full flex items-center justify-between p-4 bg-muted hover:bg-primary/10 hover:text-primary rounded-2xl transition-all text-sm font-bold"
              >
                Create New Program <Plus size={18} />
              </Link>
              <Link
                href={`/admin/academics/courses/new?deptId=${department.id}`}
                className="w-full flex items-center justify-between p-4 bg-muted hover:bg-primary/10 hover:text-primary rounded-2xl transition-all text-sm font-bold"
              >
                Add New Course <Plus size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Programs List */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl">
                  <BookOpen size={20} />
                </div>
                Offered Programs
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {department.programs.map((program) => (
                <div
                  key={program.id}
                  className="bg-card p-6 rounded-3xl border border-border hover:border-primary transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center font-black text-primary">
                        {program.code?.substring(0, 2) || "PR"}
                      </div>
                      <div>
                        <h4 className="font-black group-hover:text-primary transition-colors">
                          {program.name}
                        </h4>
                        <p className="text-xs text-muted-foreground font-medium">
                          {program.durationMonths} Months Duration
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/admin/academics/programs/${program.id}`}
                      className="p-3 bg-muted group-hover:bg-primary group-hover:text-primary-foreground rounded-2xl transition-all"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              ))}
              {department.programs.length === 0 && (
                <div className="text-center py-10 bg-muted/20 rounded-3xl border border-dashed border-border">
                  <p className="text-muted-foreground font-medium">
                    No programs assigned to this department yet.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
