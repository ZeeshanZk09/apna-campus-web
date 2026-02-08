"use client";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useTheme } from "@/hooks/ThemeChanger";
import toastService from "@/lib/services/toastService";

function ResetPasswordForm() {
  const { isDarkMode } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        toastService.error("Passwords do not match");
        return;
      }
      if (!token) {
        toastService.error("Missing reset token");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password: value.password }),
        });
        const data = await response.json();
        if (data.success) {
          toastService.success(
            "Password reset successfully! Redirecting to login...",
          );
          setTimeout(() => router.push("/login"), 2000);
        } else {
          toastService.error(data.error || "Reset failed");
        }
      } catch (_err) {
        toastService.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  if (!token) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-black text-red-500">Invalid Link</h2>
        <p className="mt-2 text-muted-foreground">
          This password reset link is missing its token or is malformed.
        </p>
        <Link
          href="/forgot-password"
          title="Go to forgot password"
          className="mt-4 inline-block text-primary font-bold hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-black tracking-tight">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground font-medium">
          Create a new, strong password for your account.
        </p>
      </div>

      <div
        className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md ${
          isDarkMode
            ? "bg-zinc-900 border-zinc-800"
            : "bg-white border-zinc-200"
        } border rounded-2xl shadow-xl overflow-hidden`}
      >
        <div className="py-8 px-4 sm:px-10">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <form.Field name="password">
              {(field) => (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className={`block w-full px-4 py-3 rounded-xl outline-none transition-all ${
                        isDarkMode
                          ? "bg-zinc-800 border-zinc-700 focus:border-primary"
                          : "bg-zinc-50 border-zinc-200 focus:border-primary"
                      } border`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </form.Field>

            <form.Field name="confirmPassword">
              {(field) => (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    className={`block w-full px-4 py-3 rounded-xl outline-none transition-all ${
                      isDarkMode
                        ? "bg-zinc-800 border-zinc-700 focus:border-primary"
                        : "bg-zinc-50 border-zinc-200 focus:border-primary"
                    } border`}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-black text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all uppercase tracking-widest"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center font-black animate-pulse">
          LOADING...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
