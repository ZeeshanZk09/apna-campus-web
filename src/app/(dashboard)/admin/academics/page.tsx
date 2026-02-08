// src/app/admin/academics/page.tsx

import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Component,
  GraduationCap,
  Layers,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  getAllCohorts,
  getAllDepartments,
  getAllPrograms,
} from "@/lib/queries/academicQueries";

export const dynamic = "force-dynamic";

export default async function AcademicsPage() {
  const [cohorts, departments, programs] = await Promise.all([
    getAllCohorts(),
    getAllDepartments(),
    getAllPrograms(),
  ]);

  const stats = [
    {
      label: "Departments",
      count: departments.length,
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Programs",
      count: programs.length,
      icon: Component,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Active Cohorts",
      count: cohorts.length,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Courses",
      count: departments.reduce((acc, d) => acc + d.courses.length, 0),
      icon: BookOpen,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Academic Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage institutional structure, program offerings, and student
            batches.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/academics/cohorts/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            <Plus size={18} /> New Cohort
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Structure Management */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="text-primary" size={22} /> Academic
                Departments
              </h2>
              <Link
                href="/admin/academics/departments"
                className="text-sm text-primary font-bold hover:underline"
              >
                Manage All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.slice(0, 4).map((dept) => (
                <div
                  key={dept.id}
                  className="bg-card p-5 rounded-3xl border border-border hover:border-primary/30 transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold group-hover:text-primary transition-colors">
                      {dept.name}
                    </h3>
                    <span className="px-2 py-1 bg-muted text-[10px] font-black rounded-lg uppercase tracking-wider">
                      Dept
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Layers size={14} /> {dept.programs.length} Programs
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} /> {dept.courses.length} Courses
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Clock className="text-orange-500" size={22} /> Academic Batches
                (Cohorts)
              </h2>
              <Link
                href="/admin/academics/cohorts"
                className="text-sm text-primary font-bold hover:underline"
              >
                Manage All
              </Link>
            </div>
            <div className="bg-card rounded-3xl border border-border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Cohort Name</th>
                    <th className="px-6 py-4">Program</th>
                    <th className="px-6 py-4">Students</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cohorts.slice(0, 5).map((cohort) => (
                    <tr
                      key={cohort.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm">{cohort.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(cohort.startDate).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                        {cohort.program?.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {[
                            ...Array(Math.min(3, cohort.enrollments.length)),
                          ].map((_, i) => (
                            <div
                              key={i}
                              className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold"
                            >
                              {cohort.enrollments[i]?.user.username[0]}
                            </div>
                          ))}
                          {cohort.enrollments.length > 3 && (
                            <div className="w-7 h-7 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-[10px] font-bold">
                              +{cohort.enrollments.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-primary/10 rounded-xl text-primary transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Quick Tools & Insights */}
        <div className="space-y-6">
          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
            <h3 className="font-black mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-card rounded-2xl border border-border hover:border-primary transition-all text-sm font-bold">
                Generate Attendance Report <ChevronRight size={16} />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-card rounded-2xl border border-border hover:border-primary transition-all text-sm font-bold">
                Bulk Enrollment <ChevronRight size={16} />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-card rounded-2xl border border-border hover:border-primary transition-all text-sm font-bold">
                Course Mapping <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-black">
              <CheckCircle2 size={20} /> System Status
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold opacity-70">Grading Sync</span>
                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full font-bold text-[8px] uppercase">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold opacity-70">Semester Rollover</span>
                <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-black text-[8px] uppercase">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
