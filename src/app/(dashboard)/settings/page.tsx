import { getSessionUser } from "@/app/actions/auth";
import ActiveSessions from "@/components/profile/ActiveSessions";
import ApiKeyManager from "@/components/profile/ApiKeyManager";
import PasswordForm from "@/components/profile/PasswordForm";
import ProfileForm from "@/components/profile/ProfileForm";
import TwoFactorAuth from "@/components/profile/TwoFactorAuth";
import db from "@/lib/prisma";

export default async function SettingsPage() {
  const user = await getSessionUser();

  if (!user) return null;

  // Fetch full user for 2FA status - wait, getSessionUser should handle this or we fetch specifically
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { twoFactorEnabled: true },
  });

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-black dark:text-white">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your profile information and security preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Section */}
        <div className="md:col-span-1">
          <h2 className="text-lg font-bold mb-2">Public Profile</h2>
          <p className="text-sm text-muted-foreground">
            This information will be visible to other users in the platform.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="bg-card p-6 rounded-3xl border border-border">
            <ProfileForm user={user} />
          </div>
        </div>

        {/* Security Section: Password */}
        <div className="md:col-span-1 pt-10 border-t border-border">
          <h2 className="text-lg font-bold mb-2">Password</h2>
          <p className="text-sm text-muted-foreground">
            Update your password periodically to keep your account secure.
          </p>
        </div>
        <div className="md:col-span-2 pt-10 border-t border-border">
          <div className="bg-card p-6 rounded-3xl border border-border">
            <PasswordForm />
          </div>
        </div>

        {/* Security Section: 2FA */}
        <div className="md:col-span-1 pt-10 border-t border-border">
          <h2 className="text-lg font-bold mb-2">Two-Factor Authentication</h2>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account.
          </p>
        </div>
        <div className="md:col-span-2 pt-10 border-t border-border">
          <div className="bg-card p-6 rounded-3xl border border-border">
            <TwoFactorAuth initialEnabled={dbUser?.twoFactorEnabled || false} />
          </div>
        </div>

        {/* Security Section: Sessions */}
        <div className="md:col-span-1 pt-10 border-t border-border">
          <h2 className="text-lg font-bold mb-2">Active Sessions</h2>
          <p className="text-sm text-muted-foreground">
            Manage and log out of your active sessions on other devices.
          </p>
        </div>
        <div className="md:col-span-2 pt-10 border-t border-border">
          <div className="bg-card p-6 rounded-3xl border border-border">
            <ActiveSessions />
          </div>
        </div>

        {/* API Keys Section */}
        <div className="md:col-span-1 pt-10 border-t border-border">
          <h2 className="text-lg font-bold mb-2">API Keys</h2>
          <p className="text-sm text-muted-foreground">
            Generate and manage API keys for application integration.
          </p>
        </div>
        <div className="md:col-span-2 pt-10 border-t border-border">
          <div className="bg-card p-6 rounded-3xl border border-border">
            <ApiKeyManager />
          </div>
        </div>
      </div>
    </div>
  );
}
