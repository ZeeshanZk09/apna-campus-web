/**
 * Navigation configuration for sidebar menus.
 * Defines routes, icons, and role-based visibility.
 */
import {
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Settings,
  Shield,
  Users,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: string[]; // If empty, visible to all
  children?: NavItem[];
}

/** Admin sidebar navigation */
export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    children: [
      { label: "All Users", href: "/admin/users", icon: Users },
      { label: "Students", href: "/admin/users/students", icon: GraduationCap },
      { label: "Teachers", href: "/admin/users/teachers", icon: Briefcase },
    ],
  },
  {
    label: "Academics",
    href: "/admin/academics",
    icon: BookOpen,
    children: [
      {
        label: "Departments",
        href: "/admin/academics/departments",
        icon: BookOpen,
      },
      {
        label: "Programs",
        href: "/admin/academics/programs",
        icon: GraduationCap,
      },
      { label: "Courses", href: "/admin/academics/courses", icon: BookOpen },
      { label: "Cohorts", href: "/admin/academics/cohorts", icon: Users },
      {
        label: "Attendance",
        href: "/admin/academics/attendance",
        icon: Calendar,
      },
    ],
  },
  {
    label: "Assessments",
    href: "/admin/academics/assessments",
    icon: ClipboardList,
    children: [
      {
        label: "All Assessments",
        href: "/admin/academics/assessments",
        icon: ClipboardList,
      },
      { label: "Exams", href: "/admin/academics/exams", icon: FileText },
    ],
  },
  { label: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
  {
    label: "Communication",
    href: "/admin/communication",
    icon: MessageSquare,
    children: [
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
      { label: "Announcements", href: "/admin/communication", icon: Bell },
    ],
  },
  { label: "Finance", href: "/admin/finance", icon: CreditCard },
  {
    label: "Monitoring",
    href: "/admin/monitoring",
    icon: BarChart3,
    children: [
      { label: "Overview", href: "/admin/monitoring", icon: BarChart3 },
      {
        label: "Audit Logs",
        href: "/admin/monitoring/audit-logs",
        icon: Shield,
      },
      { label: "News/Posts", href: "/admin/monitoring/news", icon: FileText },
      { label: "Settings", href: "/admin/monitoring/settings", icon: Settings },
    ],
  },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

/** Student/Teacher/Parent sidebar navigation */
export const dashboardNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Activity", href: "/activity", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];
