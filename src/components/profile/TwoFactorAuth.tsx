"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TwoFactorAuthProps {
  initialEnabled: boolean;
}

export default function TwoFactorAuth({ initialEnabled }: TwoFactorAuthProps) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [showSetup, setShowSetup] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const startSetup = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setQrCode(data.qrCodeUrl);
        setShowSetup(true);
      } else {
        toast.error(data.error || "Failed to start 2FA setup");
      }
    } catch (_err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifySetup = async () => {
    if (!token) return toast.error("Please enter the verification code");
    setLoading(true);
    try {
      const res = await fetch("/api/user/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEnabled(true);
        setShowSetup(false);
        toast.success("2FA enabled successfully");
      } else {
        toast.error(data.error || "Invalid code");
      }
    } catch (_err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (
      !confirm(
        "Are you sure you want to disable 2FA? This will make your account less secure.",
      )
    )
      return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/2fa/disable", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIsEnabled(false);
        toast.success("2FA disabled");
      } else {
        toast.error(data.error || "Failed to disable 2FA");
      }
    } catch (_err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-md font-bold">Authenticator App</h3>
          <p className="text-sm text-muted-foreground">
            Use an app like Google Authenticator or Authy to get verification
            codes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${isEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {!isEnabled && !showSetup && (
        <Button
          onClick={startSetup}
          disabled={loading}
          variant="outline"
          className="rounded-xl"
        >
          Setup 2FA
        </Button>
      )}

      {showSetup && qrCode && (
        <div className="bg-muted/50 p-4 rounded-2xl border border-dashed border-border space-y-4">
          <p className="text-sm font-medium">
            1. Scan this QR code with your authenticator app:
          </p>
          <div className="bg-white p-2 inline-block rounded-xl">
            <Image src={qrCode} alt="2FA QR Code" width={160} height={160} />
          </div>
          <p className="text-sm font-medium">
            2. Enter the 6-digit code from the app:
          </p>
          <div className="flex gap-2 max-w-xs">
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="000000"
              className="rounded-xl"
            />
            <Button
              onClick={verifySetup}
              disabled={loading}
              className="rounded-xl"
            >
              Verify
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowSetup(false)}
            className="text-xs"
          >
            Cancel
          </Button>
        </div>
      )}

      {isEnabled && (
        <Button
          onClick={disable2FA}
          disabled={loading}
          variant="outline"
          className="text-red-500 border-red-200 hover:bg-red-50 rounded-xl"
        >
          Disable Two-Factor Authentication
        </Button>
      )}
    </div>
  );
}
