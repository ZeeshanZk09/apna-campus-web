"use client";

import { Loader2, LogOut, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Session {
  id: string;
  ip: string;
  expiresAt: string;
}

export default function ActiveSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/user/sessions");
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const terminateSession = async (id: string) => {
    setTerminating(id);
    try {
      const res = await fetch(`/api/user/sessions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSessions(sessions.filter((s) => s.id !== id));
        toast.success("Session terminated");
      } else {
        toast.error("Failed to terminate session");
      }
    } catch (_err) {
      toast.error("Something went wrong");
    } finally {
      setTerminating(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No other active sessions found.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Monitor className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{session.ip}</p>
                  <p className="text-xs text-muted-foreground">
                    Expires: {new Date(session.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => terminateSession(session.id)}
                disabled={terminating === session.id}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
              >
                {terminating === session.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
