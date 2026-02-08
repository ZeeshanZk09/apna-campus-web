// src/components/dashboard/StudentDashboard.tsx

import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import StatCard from "./StatCard";

interface Enrollment {
  id: string;
  cohort: {
    name: string;
    program?: { name: string } | null;
  };
}

interface Submission {
  id?: string;
  createdAt: string | Date;
  assignment?: { title: string } | null;
}

interface StudentDashboardData {
  activeCoursesCount: number;
  submissionsCount: number;
  attendanceRate: number;
  enrollments: Enrollment[];
  recentSubmissions: Submission[];
}

interface StudentDashboardProps {
  data: StudentDashboardData;
  user: { username: string; role: string };
}

export default function StudentDashboard({
  data,
  user,
}: StudentDashboardProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight dark:text-white">
          Welcome back, {user?.username || "Student"}!
        </h2>
        <p className="text-slate-500 font-medium">
          Here's what's happening with your learning journey today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Cohorts"
          value={data.activeCoursesCount.toString()}
          icon={BookOpen}
          color="bg-blue-600"
        />
        <StatCard
          title="Submissions"
          value={data.submissionsCount.toString()}
          icon={ClipboardList}
          color="bg-amber-500"
        />
        <StatCard
          title="Attendance"
          value={`${data.attendanceRate}%`}
          icon={CheckCircle}
          color="bg-emerald-500"
        />
        <StatCard
          title="Study Status"
          value="Active"
          icon={Clock}
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-3xl p-8 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black dark:text-white">
              Active Programs
            </h3>
            <Link
              href="/dashboard/courses"
              className="text-xs font-bold text-primary hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {data.enrollments.length > 0 ? (
              data.enrollments.map((en) => (
                <div
                  key={en.id}
                  className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">
                        {en.cohort.program?.name || "Academic Program"}
                      </h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-black">
                        {en.cohort.name}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-primary/10 rounded-lg text-primary">
                    <ChevronRight size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No active enrollments found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
          <h3 className="text-lg font-black mb-8 dark:text-white">
            Recent Submissions
          </h3>
          <div className="space-y-4">
            {data.recentSubmissions.length > 0 ? (
              data.recentSubmissions.map((sub, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {sub.assignment?.title || "Assignment"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-sm text-muted-foreground">
                None yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
