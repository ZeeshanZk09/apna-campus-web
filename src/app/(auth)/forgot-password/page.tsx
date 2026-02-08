"use client";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/hooks/ThemeChanger";
import toastService from "@/lib/services/toastService";

export default function ForgotPasswordPage() {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });
        const data = await response.json();
        if (data.success) {
          toastService.success(data.message);
        } else {
          toastService.error(data.error || "Something went wrong");
        }
      } catch (_err) {
        toastService.error("Failed to send reset link");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen px-4 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-black tracking-tight">
          Forgot Password
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground font-medium">
          Enter your email to receive a password reset link.
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
            <form.Field name="email">
              {(field) => (
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-bold text-primary hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
