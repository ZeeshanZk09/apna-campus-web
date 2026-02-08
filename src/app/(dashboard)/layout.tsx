import { redirect } from "next/navigation";
import { getSessionUser } from "@/app/actions/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import GlobalSearch from "@/components/dashboard/GlobalSearch";
import NotificationCenter from "@/components/dashboard/NotificationCenter";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = user.role === "ADMIN" || user.role === "STAFF";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617]">
      {isAdmin ? <AdminSidebar /> : <DashboardSidebar role={user.role} />}
      <div className="flex-1 flex flex-col">
        <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-6">
            <NotificationCenter />

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black dark:text-white">
                  {user.username}
                </span>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">
                  {user.role}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/20">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8 flex-1">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
