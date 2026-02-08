// src/components/dashboard/AdminDashboard.tsx

import {
  Activity,
  ArrowRight,
  BookOpen,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  Layers,
  MessageSquare,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import StatCard from "./StatCard";

interface AdminDashboardProps {
  data: {
    studentCount: number;
    teacherCount: number;
    activeCohorts: number;
    pendingInvoices: number;
    totalRevenue: number;
    courseCount: number;
    recentAuditLogs?: {
      id: string;
      action: string;
      resource: string | null;
      createdAt: string;
      user: { username: string } | null;
    }[];
  };
  user: {
    username: string;
    role: string;
  };
}

const quickActions = [
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: Users,
    color: "bg-blue-600",
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
    color: "bg-emerald-600",
  },
  {
    label: "Academics",
    href: "/admin/academics",
    icon: GraduationCap,
    color: "bg-purple-600",
  },
  {
    label: "Finance",
    href: "/admin/finance",
    icon: CreditCard,
    color: "bg-rose-500",
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
    color: "bg-indigo-500",
  },
  {
    label: "Monitoring",
    href: "/admin/monitoring",
    icon: Shield,
    color: "bg-amber-500",
  },
];

export default function AdminDashboard({ data, user }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight dark:text-white">
            Institute Overview
          </h2>
          <p className="text-slate-500 font-medium">
            Welcome back, {user.username}. Here's your system summary.
          </p>
        </div>
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all w-fit"
        >
          Admin Portal <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={data.studentCount}
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          title="Active Cohorts"
          value={data.activeCohorts}
          icon={Layers}
          color="bg-purple-600"
        />
        <StatCard
          title="Pending Fees"
          value={data.pendingInvoices}
          icon={CreditCard}
          color="bg-rose-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${data.totalRevenue?.toLocaleString() ?? 0}`}
          icon={TrendingUp}
          color="bg-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-card rounded-3xl p-8 border border-border shadow-sm">
          <h3 className="text-lg font-black dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-muted/20 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div
                  className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <action.icon size={22} />
                </div>
                <span className="text-sm font-bold">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
          <h3 className="text-lg font-black mb-6 dark:text-white">
            At a Glance
          </h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                <span className="text-sm font-medium">Teachers</span>
              </div>
              <span className="text-sm font-black">
                {data.teacherCount ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium">Courses</span>
              </div>
              <span className="text-sm font-black">
                {data.courseCount ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">Pending Invoices</span>
              </div>
              <span className="text-sm font-black">
                {data.pendingInvoices ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black dark:text-white">
            Recent System Activity
          </h3>
          <Link
            href="/admin/monitoring/audit-logs"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>
        {data.recentAuditLogs && data.recentAuditLogs.length > 0 ? (
          <div className="space-y-3">
            {data.recentAuditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Activity size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{log.action}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {log.user?.username ?? "System"} • {log.resource ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={12} />
                  <span className="text-[10px] font-medium">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No recent activity.{" "}
            <Link
              href="/admin/monitoring/audit-logs"
              className="text-primary hover:underline"
            >
              View audit logs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
