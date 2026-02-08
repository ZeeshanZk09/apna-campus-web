import {
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgramById } from "@/lib/queries/academicQueries";

export default async function ProgramDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const program = await getProgramById(params.id);

  if (!program) notFound();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="bg-card p-10 rounded-[40px] border border-border relative overflow-hidden shadow-2xl shadow-primary/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
                <BookOpen size={28} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-indigo-600">
                Academic Program
              </p>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
              {program.name}
            </h1>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted px-4 py-2 rounded-xl">
                <GraduationCap size={16} /> {program.department?.name}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-muted px-4 py-2 rounded-xl">
                <Clock size={16} /> {program.durationMonths} Months
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/admin/academics/programs/${program.id}/edit`}
              className="px-8 py-3.5 bg-secondary text-secondary-foreground rounded-2xl text-sm font-bold hover:bg-secondary/80 transition-all border border-border uppercase tracking-widest"
            >
              Edit Program
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Core Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-600/20">
            <h3 className="font-black text-xl mb-6">Program Stats</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                  Enrolled Students
                </p>
                <h4 className="text-4xl font-black">
                  {program.cohorts.reduce(
                    (acc, c) => acc + c.enrollments.length,
                    0,
                  )}
                </h4>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                  Active Cohorts
                </p>
                <h4 className="text-4xl font-black">
                  {program.cohorts.length}
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-3xl border border-border">
            <h4 className="font-black text-sm mb-4 uppercase tracking-widest text-muted-foreground">
              Navigation
            </h4>
            <div className="space-y-2">
              <Link
                href={`/admin/academics/cohorts/new?programId=${program.id}`}
                className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all text-xs font-bold"
              >
                <Plus size={16} /> Create New Batch
              </Link>
              <Link
                href={`/admin/academics/courses/new?programId=${program.id}`}
                className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all text-xs font-bold"
              >
                <Plus size={16} /> Assign Course
              </Link>
            </div>
          </div>
        </div>

        {/* Content Tabs Area */}
        <div className="lg:col-span-3 space-y-10">
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Calendar className="text-indigo-600" size={24} />
              Academic Batches (Cohorts)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {program.cohorts.map((cohort) => (
                <div
                  key={cohort.id}
                  className="bg-card p-6 rounded-3xl border border-border hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-lg">{cohort.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Started{" "}
                        {new Date(cohort.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-full uppercase">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <Users size={14} /> {cohort.enrollments.length} Students
                    </div>
                    <Link
                      href={`/admin/academics/cohorts/${cohort.id}`}
                      className="text-indigo-600 font-black text-xs hover:underline"
                    >
                      Manage Batch
                    </Link>
                  </div>
                </div>
              ))}
              {program.cohorts.length === 0 && (
                <p className="text-muted-foreground italic col-span-2 py-10 text-center bg-muted/20 rounded-3xl border border-dashed border-border">
                  No cohorts created for this program yet.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <BookOpen className="text-indigo-600" size={24} /> Curriculum
              Courses
            </h2>
            <div className="bg-card rounded-3xl border border-border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-muted/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Course Code</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Credits</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {program.courses.map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-bold">
                        {course.code}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">
                        {course.title}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {course.creditHours}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/academics/courses/${course.id}`}
                          className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg inline-block"
                        >
                          <ChevronRight size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
