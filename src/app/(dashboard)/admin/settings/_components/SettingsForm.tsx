// src/app/admin/settings/_components/SettingsForm.tsx
"use client";

import { Globe, Palette, Save, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { updateSettingsAction } from "@/app/actions/settings";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateSettingsAction(settings);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {/* General Settings */}
      <section className="bg-card p-6 rounded-xl border-border border shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-lg font-semibold">
          <Globe className="w-5 h-5 text-blue-500" />
          General Configuration
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">LMS Name</label>
            <input
              type="text"
              className="w-full p-2 rounded-md border bg-background border-border"
              value={settings.site_name || ""}
              onChange={(e) => handleChange("site_name", e.target.value)}
              placeholder="e.g., Apna Campus LMS"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Support Email</label>
            <input
              type="email"
              className="w-full p-2 rounded-md border bg-background border-border"
              value={settings.support_email || ""}
              onChange={(e) => handleChange("support_email", e.target.value)}
              placeholder="support@example.com"
            />
          </div>
        </div>
      </section>

      {/* Academic Settings */}
      <section className="bg-card p-6 rounded-xl border-border border shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-lg font-semibold">
          <Palette className="w-5 h-5 text-purple-500" />
          Academic Policy
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Default Passing Grade (%)
            </label>
            <input
              type="number"
              className="w-full p-2 rounded-md border bg-background border-border"
              value={settings.passing_grade || "40"}
              onChange={(e) => handleChange("passing_grade", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency Symbol</label>
            <input
              type="text"
              className="w-full p-2 rounded-md border bg-background border-border"
              value={settings.currency || "PKR"}
              onChange={(e) => handleChange("currency", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Security & Access */}
      <section className="bg-card p-6 rounded-xl border-border border shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-lg font-semibold">
          <Shield className="w-5 h-5 text-red-500" />
          Security & Access
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded text-primary"
              checked={settings.allow_public_registration === "true"}
              onChange={(e) =>
                handleChange(
                  "allow_public_registration",
                  e.target.checked ? "true" : "false",
                )
              }
            />
            <span className="text-sm font-medium">
              Allow New Student Registration
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded text-primary"
              checked={settings.force_2fa === "true"}
              onChange={(e) =>
                handleChange("force_2fa", e.target.checked ? "true" : "false")
              }
            />
            <span className="text-sm font-medium">
              Force Multi-Factor Authentication (Staff)
            </span>
          </label>
        </div>
      </section>

      <div className="fixed bottom-6 right-6">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
