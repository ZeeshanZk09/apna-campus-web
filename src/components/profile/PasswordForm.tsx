"use client";

import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import toastService from "@/lib/services/toastService";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toastService.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/user/change-password", {
        currentPassword,
        newPassword,
      });

      toastService.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toastService.error(
        err.response?.data?.error || "Failed to update password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
            required
            minLength={8}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Lock size={18} />
        )}
        Update Password
      </button>
    </form>
  );
}
