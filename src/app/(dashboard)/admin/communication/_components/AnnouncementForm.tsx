"use client";

import { Info, Loader2, Megaphone, Send, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { createAnnouncementAction } from "@/app/actions/communication";

export default function AnnouncementForm({ adminId }: { adminId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await createAnnouncementAction(formData, adminId);
      if (result.success) {
        toast.success("Broadcast sent successfully to all users!");
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to send announcement");
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 group"
      >
        <Megaphone
          size={18}
          className="group-hover:-rotate-12 transition-transform"
        />
        New Campus Broadcast
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-black/5">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black text-white rounded-2xl shadow-lg">
                  <Megaphone size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase italic">
                    Institutional Broadcast
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Broadcasting to all active users
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-12 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Broadcast Subject
                </label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Campus Holiday Notice"
                  className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-black transition-all placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Detailed Announcement
                </label>
                <textarea
                  name="body"
                  required
                  rows={6}
                  placeholder="Enter the message body here..."
                  className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] text-sm font-bold focus:ring-2 focus:ring-black transition-all resize-none placeholder:text-slate-300"
                ></textarea>
              </div>

              <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-4">
                <Info
                  size={20}
                  className="text-indigo-600 mt-1 flex-shrink-0"
                />
                <p className="text-xs font-bold text-indigo-900 leading-relaxed uppercase tracking-tight">
                  This action will send a push notification and internal message
                  to{" "}
                  <span className="underline decoration-indigo-400 decoration-2">
                    every single user
                  </span>{" "}
                  in the system. Use responsibly.
                </p>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-8 py-6 bg-slate-100 text-slate-500 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] px-8 py-6 bg-black text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-black/90 transition-all flex items-center justify-center gap-3 shadow-2xl disabled:bg-slate-200"
                >
                  {isSubmitting ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      Execute Broadcast
                      <Send
                        size={20}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
