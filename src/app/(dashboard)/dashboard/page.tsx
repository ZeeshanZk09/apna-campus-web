import { getSessionUser } from "@/app/actions/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ParentDashboard from "@/components/dashboard/ParentDashboard";

import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import {
  getParentDashboardData,
  getStudentDashboardData,
  getTeacherDashboardData,
} from "@/lib/queries/dashboardData";
import { getAdminStats } from "@/lib/queries/dashboardQueries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;

  let content;

  switch (user.role) {
    case "ADMIN":
    case "STAFF": {
      const adminData = await getAdminStats();
      content = <AdminDashboard data={adminData} user={user} />;
      break;
    }
    case "TEACHER": {
      const teacherData = await getTeacherDashboardData(user.id);
      content = <TeacherDashboard data={teacherData} user={user} />;
      break;
    }
    case "PARENT":
    case "GUARDIAN": {
      const parentData = await getParentDashboardData(user.id);
      content = <ParentDashboard data={parentData} user={user} />;
      break;
    }
    default: {
      const studentData = await getStudentDashboardData(user.id);
      content = <StudentDashboard data={studentData} user={user} />;
      break;
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">{content}</div>
  );
}
