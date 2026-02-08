// src/components/dashboard/ParentDashboard.tsx

import {
  Calendar,
  ChevronRight,
  CreditCard,
  GraduationCap,
  Heart,
  User,
} from "lucide-react";
import Link from "next/link";
import StatCard from "./StatCard";

interface ChildEnrollment {
  id: string;
  status: string;
  cohort?: { name: string; program?: { name: string } | null } | null;
  Attendance?: { id: string; date: string | Date; status: string }[];
}

interface ChildData {
  id: string;
  username: string;
  enrollments?: ChildEnrollment[];
  Enrollment?: ChildEnrollment[];
}

interface ParentDashboardData {
  children: ChildData[];
  totalChildren: number;
}

interface ParentDashboardProps {
  data: ParentDashboardData;
  user: { username: string; role: string };
}

export default function ParentDashboard({ data, user }: ParentDashboardProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight dark:text-white">
          Welcome, {user?.username}
        </h2>
        <p className="text-slate-500 font-medium">
          Monitor your children's educational progress and upcoming events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Registered Children"
          value={data.totalChildren}
          icon={Heart}
          color="bg-rose-500"
        />
        <StatCard
          title="Enrolled Classes"
          value={data.children.reduce(
            (acc, c) =>
              acc + (c.Enrollment?.length || c.enrollments?.length || 0),
            0,
          )}
          icon={GraduationCap}
          color="bg-blue-600"
        />
        <StatCard
          title="Unpaid Invoices"
          value="0"
          icon={CreditCard}
          color="bg-amber-500"
        />
        <StatCard
          title="Upcoming Meetings"
          value="1"
          icon={Calendar}
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
          <h3 className="text-lg font-black dark:text-white mb-8">
            Student Progress Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.children.map((child) => (
              <div
                key={child.id}
                className="p-6 border border-border rounded-3xl bg-muted/20 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <User size={64} />
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl">
                    {child.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{child.username}</h4>
                    <p className="text-xs text-muted-foreground">
                      ID: {child.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {(child.Enrollment || child.enrollments)?.map((en) => (
                    <div key={en.id} className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold">{en.cohort?.name}</span>
                        <span className="text-muted-foreground">
                          {en.status}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/dashboard/children/${child.id}`}
                  className="mt-6 w-full py-2.5 bg-white dark:bg-slate-800 border border-border rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  View Detailed Report <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
