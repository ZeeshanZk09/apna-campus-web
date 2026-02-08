// src/components/dashboard/TeacherDashboard.tsx

import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import StatCard from "./StatCard";

interface TeacherDashboardProps {
  data: {
    activeClassesCount: number;
    totalStudents: number;
    assignmentsCount: number;
    classes: {
      id: string;
      name: string;
      program?: { name: string } | null;
      enrollments?: { id: string }[];
    }[];
    recentSubmissions?: {
      createdAt: string | Date;
      student?: { username: string };
    }[];
  };
  user: { username: string; role: string };
}

export default function TeacherDashboard({
  data,
  user,
}: TeacherDashboardProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight dark:text-white">
          Welcome, Prof. {user?.username}!
        </h2>
        <p className="text-slate-500 font-medium">
          Manage your classes and monitor student progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Classes"
          value={data.activeClassesCount}
          icon={Users}
          color="bg-indigo-600"
        />
        <StatCard
          title="Total Students"
          value={data.totalStudents}
          icon={GraduationCap}
          color="bg-emerald-600"
        />
        <StatCard
          title="Assignments"
          value={data.assignmentsCount}
          icon={ClipboardList}
          color="bg-amber-600"
        />
        <StatCard
          title="Pending Reviews"
          value={data.recentSubmissions?.length ?? 0}
          icon={TrendingUp}
          color="bg-rose-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-3xl p-8 border border-border shadow-sm">
          <h3 className="text-lg font-black dark:text-white mb-6">
            My Assigned Cohorts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.classes.map((c: any) => (
              <div
                key={c.id}
                className="p-5 border border-border rounded-2xl hover:border-primary/50 transition-all bg-muted/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">
                    Active
                  </span>
                </div>
                <h4 className="font-bold text-base mb-1">{c.name}</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  {c.program?.name}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <span className="text-xs font-medium">
                    {c.enrollments?.length || 0} Students
                  </span>
                  <Link
                    href={`/dashboard/classes/${c.id}`}
                    className="text-xs font-bold text-primary flex items-center gap-1"
                  >
                    Manage <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
          <h3 className="text-lg font-black mb-8 dark:text-white">
            Recent Submissions
          </h3>
          <div className="space-y-4">
            {(data.recentSubmissions?.length ?? 0) > 0 ? (
              data.recentSubmissions?.map(
                (
                  sub: {
                    student?: { username: string } | null;
                    createdAt: string | Date;
                  },
                  i: number,
                ) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-4 bg-muted/40 rounded-2xl border border-border/50"
                  >
                    <div className="flex justify-between">
                      <span className="text-[10px] font-black uppercase text-blue-500">
                        {sub.student?.username}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold truncate">
                      Assignment Submission
                    </p>
                    <button className="text-[10px] font-black mt-2 py-1.5 bg-primary text-white rounded-lg">
                      Review Now
                    </button>
                  </div>
                ),
              )
            ) : (
              <div className="text-center py-10 text-muted-foreground italic text-sm">
                No new submissions to review.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
