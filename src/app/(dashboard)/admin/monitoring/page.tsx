import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock,
  Database,
  FileText,
  HardDrive,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import {
  getHealthStatus,
  getMonitoringStats,
} from "@/lib/queries/monitoringQueries";

export default async function MonitoringDashboard() {
  const stats = await getMonitoringStats();
  const health = await getHealthStatus();

  return (
    <ProtectedRoute adminOnly>
      <div className="p-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white uppercase">
              Security & Monitoring
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Infrastructure health and system-wide audit telemetry.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/monitoring/settings"
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all"
            >
              <Settings size={18} />
              Config
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl w-fit mb-6">
              <Activity size={24} />
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">
              Total Logs
            </h3>
            <p className="text-3xl font-black mt-2 dark:text-white">
              {stats.totalLogs}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl w-fit mb-6">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">
              Incidents
            </h3>
            <p className="text-3xl font-black mt-2 dark:text-white">
              {stats.securityEvents}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit mb-6">
              <Database size={24} />
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">
              DB Status
            </h3>
            <p className="text-3xl font-black mt-2 dark:text-white text-emerald-600">
              {health.database}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-6">
              <Clock size={24} />
            </div>
            <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">
              System Uptime
            </h3>
            <p className="text-lg font-black mt-2 dark:text-white leading-tight">
              {health.uptime}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Logs View */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 dark:text-white">
                <FileText className="text-blue-600" />
                Recent Audit Telemetry
              </h2>
              <Link
                href="/admin/monitoring/audit-logs"
                className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"
              >
                View Forensic Report <ArrowRight size={14} />
              </Link>
            </div>

            <div className="space-y-4">
              {stats.recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-xl text-xs font-black ${
                        log.action.includes("DELETE")
                          ? "bg-red-50 text-red-600"
                          : "bg-white text-slate-600"
                      }`}
                    >
                      {log.action}
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">
                        {log.resource} Trace
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {log.user?.name || "System"} •{" "}
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-slate-300 uppercase">
                    ID: {log.id.slice(0, 8)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health & Infrastructure */}
          <div className="bg-black dark:bg-slate-950 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />

            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 mb-8">
              <ShieldCheck className="text-emerald-400" />
              Infrastructure
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Database size={18} className="text-blue-400" />
                  <span className="text-sm font-bold">Database Node</span>
                </div>
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                  OPTIMAL
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <HardDrive size={18} className="text-amber-400" />
                  <span className="text-sm font-bold">Media Storage</span>
                </div>
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                  {health.storage}
                </span>
              </div>

              <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Security Maintenance
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm font-medium">
                      SSL/TLS: TLSv1.3 Active
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium">
                      Encryption: AES-256-GCM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
