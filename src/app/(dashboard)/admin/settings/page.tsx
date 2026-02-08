// src/app/admin/settings/page.tsx

import { Settings } from "lucide-react";
import { getSystemSettings } from "@/lib/queries/settingsQueries";
import SettingsForm from "./_components/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSystemSettings();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          System Settings
        </h1>
        <p className="text-muted-foreground">
          Configure global LMS parameters, appearance, and notifications.
        </p>
      </div>

      <div className="grid gap-6">
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
