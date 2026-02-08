import {
  ArrowRight,
  Bell,
  CheckCheck,
  Mail,
  Megaphone,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { getSessionUser } from "@/app/actions/auth";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import { getRecentBroadcasts } from "@/lib/queries/chatQueries";
import AnnouncementForm from "./_components/AnnouncementForm";

export const dynamic = "force-dynamic";

export default async function CommunicationAdminPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const broadcasts = await getRecentBroadcasts(10);

  return (
    <ProtectedRoute adminOnly>
      <div className="p-10 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none">
              Command Center
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
              Institutional Communication & Broadcast Protocol
            </p>
          </div>
          <AnnouncementForm adminId={user.id} />
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-10 bg-card border border-border rounded-[3rem] shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between aspect-square">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-muted rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <MessageSquare size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight uppercase">
                  Direct Messaging
                </h3>
                <p className="text-xs font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">
                  Access the unified inbox for student and staff inquiries.
                </p>
              </div>
            </div>
            <Link
              href="/messages"
              className="flex items-center justify-between p-2 text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors"
            >
              Open Inbox <ArrowRight size={16} />
            </Link>
          </div>

          <div className="p-10 bg-slate-900 dark:bg-slate-950 text-white rounded-[3rem] shadow-2xl transition-all group flex flex-col justify-between aspect-square relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Bell size={120} />
            </div>
            <div className="space-y-6 z-10">
              <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center text-white">
                <Bell size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight uppercase italic">
                  Active Alerts
                </h3>
                <p className="text-xs font-bold text-white/40 leading-relaxed uppercase tracking-tight italic">
                  Currently broadcasting announcements to entire campus.
                </p>
              </div>
            </div>
            <div className="z-10 bg-white/5 py-4 px-6 rounded-2xl flex items-center justify-between backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-widest">
                {broadcasts.length} Recent Broadcast
                {broadcasts.length !== 1 ? "s" : ""}
              </span>
              <ArrowRight size={16} />
            </div>
          </div>

          <div className="p-10 bg-muted/30 border border-border rounded-[3rem] shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between aspect-square">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-card rounded-[1.5rem] flex items-center justify-center text-foreground shadow-inner">
                <Mail size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight uppercase">
                  Bulk Email
                </h3>
                <p className="text-xs font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">
                  Synchronize announcements with external SMTP providers for
                  email delivery.
                </p>
              </div>
            </div>
            <span className="flex items-center justify-between p-2 text-xs font-black uppercase tracking-widest text-muted-foreground/50 italic">
              Coming Soon <ArrowRight size={16} />
            </span>
          </div>
        </div>

        {/* Recent Broadcasts — Real Data */}
        <div className="bg-card rounded-[3rem] border border-border shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-border flex items-center justify-between">
            <h4 className="text-sm font-black uppercase tracking-[0.2em]">
              Recent Institutional Broadcasts
            </h4>
            <Link
              href="/admin/notifications"
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              View All Logs
            </Link>
          </div>
          <div className="divide-y divide-border">
            {broadcasts.length > 0 ? (
              broadcasts.map((broadcast) => (
                <div
                  key={broadcast.id}
                  className="px-10 py-8 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground font-black text-xs uppercase italic">
                      <Megaphone size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">
                        {broadcast.title}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {new Date(broadcast.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                        {broadcast.admin?.firstName
                          ? ` • Admin: ${broadcast.admin.firstName}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                    <CheckCheck size={12} /> Delivered
                  </div>
                </div>
              ))
            ) : (
              <div className="px-10 py-12 text-center text-muted-foreground">
                <p className="text-sm font-bold">No broadcasts yet</p>
                <p className="text-xs">
                  Use the form above to send your first campus-wide
                  announcement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
