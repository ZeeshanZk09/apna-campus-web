import { Download, LayoutGrid, List, Plus } from "lucide-react";
import UsersTable from "@/components/admin/UsersTable";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import db from "@/lib/prisma";
import { getAdminStats } from "@/lib/queries/dashboardQueries";
import AdminStats from "./_components/AdminStats";
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, users] = await Promise.all([
    getAdminStats(),
    db.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              System overview and campus operations management.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
              <Download size={16} /> Export Data
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
              <Plus size={16} /> New Enrollment
            </button>
          </div>
        </div>

        <AdminStats stats={stats} />

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">
              Recent User Registrations
            </h2>
            <div className="flex gap-2">
              <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-indigo-600">
                <LayoutGrid size={18} />
              </button>
              <button className="p-2 text-gray-400">
                <List size={18} />
              </button>
            </div>
          </div>
          <UsersTable initialUsers={users} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
