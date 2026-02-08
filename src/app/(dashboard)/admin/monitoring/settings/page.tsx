// src/app/admin/monitoring/settings/page.tsx
// import { getSystemSettings } from '@/lib/queries/monitoringQueries';

import ProtectedRoute from "@/components/ui/ProtectedRoute";
import { getSystemSettings } from "@/lib/queries/settingsQueries";
import SettingsForm from "./_components/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSystemSettings();

  return (
    <ProtectedRoute adminOnly>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure global LMS parameters and campus behavior.
          </p>
        </div>

        <div className="bg-card rounded-3xl border shadow-sm p-8">
          <SettingsForm initialSettings={settings} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
