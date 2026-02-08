import { Activity, Key, Lock, LogIn, Shield, User } from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/getAuthUser";
import prisma from "@/lib/prisma";

const getIcon = (action: string) => {
  if (action.includes("LOGIN"))
    return <LogIn size={18} className="text-blue-500" />;
  if (action.includes("PASSWORD"))
    return <Lock size={18} className="text-yellow-500" />;
  if (action.includes("2FA"))
    return <Shield size={18} className="text-green-500" />;
  if (action.includes("API_KEY"))
    return <Key size={18} className="text-purple-500" />;
  return <User size={18} className="text-gray-500" />;
};

export default async function ActivityPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const logs = await prisma.auditLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black">Security Activity</h1>
        <p className="text-muted-foreground">
          Recent security events and account changes
        </p>
      </header>

      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-border bg-white/[0.02]">
          <h2 className="font-bold flex items-center gap-2">
            <Activity size={20} className="text-blue-500" />
            Recent Activity
          </h2>
        </div>

        <div className="divide-y divide-border">
          {logs.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No activity logs found.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex items-start gap-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="mt-1">{getIcon(log.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {log.action === "SUCCESS" ? (
                          <span className="text-green-500/80">Success</span>
                        ) : (
                          <span className="text-red-500/80">Failed</span>
                        )}
                        {log.meta &&
                          typeof log.meta === "object" &&
                          (log.meta as any).reason && (
                            <span className="ml-2">
                              • {(log.meta as any).reason}
                            </span>
                          )}
                      </p>
                    </div>
                    <time className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </time>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
