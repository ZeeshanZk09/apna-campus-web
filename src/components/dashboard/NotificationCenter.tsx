"use client";

import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Bell, BellRing, Check, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/notifications");
      setNotifications(res.data.notifications || []);
    } catch (_err) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`/api/user/notifications/${id}`);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (_err) {
      console.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`/api/user/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (_err) {
      console.error("Failed to delete notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("/api/user/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (_err) {
      console.error("Failed to mark all as read");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {unreadCount > 0 ? (
          <>
            <BellRing size={20} className="text-blue-600 animate-pulse" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
              {unreadCount}
            </span>
          </>
        ) : (
          <Bell size={20} className="text-slate-400" />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="font-black text-xs uppercase tracking-widest dark:text-white">
                Notifications
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="dark:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  <Bell size={32} className="mx-auto mb-3 opacity-20" />
                  No new notifications.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-slate-50 dark:border-slate-800/10 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${!n.read ? "bg-blue-50/20 dark:bg-blue-900/10" : ""}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="grow">
                        <p
                          className={`text-xs font-bold leading-tight ${!n.read ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}
                        >
                          {n.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-2 uppercase font-black">
                          {formatDistanceToNow(new Date(n.createdAt))} ago
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* We can add buttons here if we make the container a 'group' */}
                      </div>
                      <div className="flex flex-col gap-2">
                        {!n.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(n.id);
                            }}
                            className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 transition-colors"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 text-center text-[10px] font-black uppercase tracking-widest dark:text-slate-400 hover:text-blue-600 transition-all border-t border-slate-100 dark:border-slate-800">
              Notification Center
            </button>
          </div>
        </>
      )}
    </div>
  );
}
