"use client";

import {
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const studentLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Assignments", href: "/dashboard/assignments", icon: ClipboardList },
  { label: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const teacherLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Classes", href: "/dashboard/classes", icon: Users },
  { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Gradebook", href: "/dashboard/grades", icon: BarChart3 },
  { label: "Attendance", href: "/dashboard/attendance", icon: CheckCircle },
  { label: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const parentLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Children", href: "/dashboard/children", icon: GraduationCap },
  { label: "Attendance", href: "/dashboard/attendance", icon: CheckCircle },
  { label: "Progress", href: "/dashboard/progress", icon: BarChart3 },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Communication", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const links =
    role === "TEACHER"
      ? teacherLinks
      : role === "PARENT"
        ? parentLinks
        : studentLinks;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          A
        </div>
        <span className="font-bold text-xl tracking-tight dark:text-white">
          apna campus
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname?.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 w-full transition-colors">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
