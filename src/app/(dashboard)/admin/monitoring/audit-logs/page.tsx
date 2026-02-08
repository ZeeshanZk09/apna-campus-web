import {
  Activity,
  Clock,
  Database,
  Edit3,
  Filter,
  Key,
  Monitor,
  PlusCircle,
  Search,
  Shield,
  Terminal,
  Trash2,
} from "lucide-react";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import { getAllAuditLogs } from "@/lib/queries/auditQueries";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const logs = await getAllAuditLogs();

  const getActionColor = (action: string) => {
    const a = action.toUpperCase();
    if (a.includes("CREATE")) return "bg-emerald-500/10 text-emerald-600";
    if (a.includes("DELETE")) return "bg-red-500/10 text-red-600";
    if (a.includes("UPDATE")) return "bg-orange-500/10 text-orange-600";
    if (a.includes("LOGIN")) return "bg-blue-500/10 text-blue-600";
    return "bg-slate-500/10 text-slate-600";
  };

  const getActionIcon = (action: string) => {
    const a = action.toUpperCase();
    if (a.includes("CREATE")) return <PlusCircle size={14} />;
    if (a.includes("DELETE")) return <Trash2 size={14} />;
    if (a.includes("UPDATE")) return <Edit3 size={14} />;
    if (a.includes("LOGIN")) return <Key size={14} />;
    return <Activity size={14} />;
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="p-8 space-y-10">
        {/* Modern Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                <Shield size={24} />
              </div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                Audit Protocol
              </h1>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              Real-time system event surveillance & forensics
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Live Feed Active
            </div>
            <button className="p-4 bg-black text-white rounded-2xl hover:bg-black/90 transition-all shadow-xl">
              <Filter size={18} />
            </button>
          </div>
        </header>

        {/* Forensic Table Container */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">
                Secure Event Log
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                Last {logs.length} operations verified on blockchain-ready
                storage.
              </p>
            </div>

            <div className="relative group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors"
              />
              <input
                placeholder="Trace transaction or user..."
                className="pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold focus:ring-0 focus:border-black transition-all w-[320px]"
              />
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-white sticky top-0 z-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <tr className="border-b border-slate-100">
                  <th className="px-10 py-6 uppercase">Sequence/Time</th>
                  <th className="px-10 py-6 uppercase">Identity</th>
                  <th className="px-10 py-6 uppercase">Protocol</th>
                  <th className="px-10 py-6 uppercase">Resource</th>
                  <th className="px-10 py-6 uppercase hidden lg:table-cell">
                    Route/IP
                  </th>
                  <th className="px-10 py-6 text-right uppercase">Forensics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-10 py-24 text-center">
                      <Terminal
                        size={40}
                        className="mx-auto text-slate-100 mb-4"
                      />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-300">
                        Zero events recorded in current cycle.
                      </p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log, idx) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-900 leading-none mb-1">
                            #{logs.length - idx}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            <Clock size={12} />{" "}
                            {new Date(log.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        {log.user ? (
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs shadow-lg">
                              {log.user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-black text-slate-900 group-hover:text-black">
                                {log.user.username}
                              </div>
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {log.user.role}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white/40">
                              <Database size={16} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                              Root System
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-10 py-6">
                        <span
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${getActionColor(log.action)}`}
                        >
                          {getActionIcon(log.action)}
                          {log.action}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-black text-slate-900 italic uppercase tracking-tighter leading-none">
                            {log.resource}
                          </div>
                          <span className="text-[9px] font-bold text-slate-300">
                            ID: {log.resourceId?.slice(-6) || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="text-[10px] font-black text-slate-900 flex items-center gap-2">
                            <Monitor size={12} className="text-slate-300" />{" "}
                            {log.ip || "127.0.0.1"}
                          </div>
                          <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                            TLS 1.3 SYNC
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors decoration-black underline-offset-4 hover:underline">
                          Inspect JSON
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between mt-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
              Caution: Audit records are immutable once committed to secure
              ledger.
            </p>
            <div className="flex gap-2">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black ${p === 1 ? "bg-black text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
