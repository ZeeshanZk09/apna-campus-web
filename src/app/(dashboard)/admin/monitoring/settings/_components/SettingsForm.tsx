// src/app/admin/monitoring/settings/_components/SettingsForm.tsx
"use client";

import { Bell, Globe, Save, Shield } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { updateSystemSettingsAction } from "@/app/actions/monitoring";

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: any;
}) {
  const [settings, setSettings] = useState(
    initialSettings || {
      maintenanceMode: false,
      emailNotifications: true,
      allowRegistration: true,
      campusName: "Apna Campus",
    },
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateSystemSettingsAction(settings);
    setLoading(false);

    if (res.success) {
      toast.success("Settings updated successfully");
    } else {
      toast.error("Failed to update settings");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2">
          <Globe size={18} className="text-blue-500" /> General Info
        </h3>
        <div className="space-y-2">
          <label className="text-sm font-medium">LMS/Campus Name</label>
          <input
            value={settings.campusName}
            onChange={(e) =>
              setSettings({ ...settings, campusName: e.target.value })
            }
            className="w-full p-3 rounded-xl bg-muted/50 border focus:ring-2 focus:ring-primary outline-none"
            placeholder="e.g., Apna Campus"
          />
        </div>

        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2 pt-4">
          <Shield size={18} className="text-red-500" /> Security & Access
        </h3>
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
          <div>
            <div className="font-bold">Maintenance Mode</div>
            <div className="text-xs text-muted-foreground">
              Disables student/teacher access temporarily
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) =>
              setSettings({ ...settings, maintenanceMode: e.target.checked })
            }
            className="w-5 h-5 accent-primary"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
          <div>
            <div className="font-bold">Allow Public Registration</div>
            <div className="text-xs text-muted-foreground">
              Enables the registration page for new users
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.allowRegistration}
            onChange={(e) =>
              setSettings({ ...settings, allowRegistration: e.target.checked })
            }
            className="w-5 h-5 accent-primary"
          />
        </div>

        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2 pt-4">
          <Bell size={18} className="text-orange-500" /> Communication
        </h3>
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
          <div>
            <div className="font-bold">Email Notifications</div>
            <div className="text-xs text-muted-foreground">
              Send automated alerts for exams and fees
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) =>
              setSettings({ ...settings, emailNotifications: e.target.checked })
            }
            className="w-5 h-5 accent-primary"
          />
        </div>

        <h3 className="text-lg font-bold flex items-center gap-2 border-b pb-2 pt-4">
          <Save size={18} className="text-green-500" /> Integrations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-2xl border">
            <div className="font-bold">Stripe Payments</div>
            <div className="text-xs text-muted-foreground mb-3">
              Handle tuition and registration fees
            </div>
            <button className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-lg">
              Configure
            </button>
          </div>
          <div className="p-4 bg-muted/30 rounded-2xl border">
            <div className="font-bold">Cloudinary Storage</div>
            <div className="text-xs text-muted-foreground mb-3">
              Media upload and asset management
            </div>
            <button className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-lg">
              Configure
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
      >
        <Save size={20} />
        {loading ? "Saving Changes..." : "Save All Settings"}
      </button>
    </form>
  );
}
