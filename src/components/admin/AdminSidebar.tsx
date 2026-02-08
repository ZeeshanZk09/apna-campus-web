// src/components/admin/AdminSidebar.tsx
"use client";

import {
  Activity,
  Archive,
  BookOpen,
  DollarSign,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "All Users", href: "/admin/users", icon: Users },
  { label: "Students", href: "/admin/users/students", icon: Users },
  { label: "Teachers", href: "/admin/users/teachers", icon: GraduationCap },
  { label: "Academic Hub", href: "/admin/academics", icon: Activity },
  { label: "Departments", href: "/admin/academics/departments", icon: Archive },
  { label: "Programs", href: "/admin/academics/programs", icon: BookOpen },
  { label: "Courses", href: "/admin/academics/courses", icon: Archive },
  { label: "Cohorts", href: "/admin/academics/cohorts", icon: Users },
  { label: "Financials", href: "/admin/finance", icon: DollarSign },
  { label: "Communication", href: "/admin/communication", icon: MessageSquare },
  { label: "News & Blog", href: "/admin/monitoring/news", icon: Newspaper },
  {
    label: "Security & Audit",
    href: "/admin/monitoring/audit-logs",
    icon: ShieldCheck,
  },
  { label: "Settings", href: "/admin/monitoring/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col p-4">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black">
          A
        </div>
        <span className="font-black text-lg tracking-tighter">APNA CAMPUS</span>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border mt-auto">
        <div className="px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
            Support
          </p>
          <p className="text-xs text-muted-foreground leading-tight">
            Need help with the LMS system?
          </p>
          <button className="text-xs font-bold text-primary mt-2">
            Open Guide
          </button>
        </div>
      </div>
    </div>
  );
}
