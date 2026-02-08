"use client";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeClosed, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/hooks/ThemeChanger";
import { useLoginUser, useVerify2FA } from "@/hooks/useUserQueries";
import toastService from "@/lib/services/toastService";

export default function LoginForm() {
  const [see, setSee] = useState<boolean>(false);
  const [show2FA, setShow2FA] = useState<boolean>(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState<string>("");
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const loginMutation = useLoginUser();
  const verify2FAMutation = useVerify2FA();

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      console.log("Submitting form with values:", value);
      try {
        const mutationData: any = {
          username: value.username,
          email: value.email,
          password: value.password,
        };

        loginMutation.mutate(mutationData, {
          onSuccess: (data: any) => {
            if (data.twoFactorRequired) {
              setShow2FA(true);
              setTempUserId(data.userId);
              toastService.info("Two-factor authentication required");
            } else {
              toastService.success("Login successful! Redirecting...");
              setTimeout(() => router.push("/dashboard"), 1500);
            }
          },
          onError: (err: any) => {
            console.error("Login error:", err);
            toastService.error(err.response?.data?.error || "Login failed");
          },
        });
      } catch (err) {
        console.error("Submission error:", err);
        toastService.error("Login failed");
      }
    },
  });

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUserId) return;

    verify2FAMutation.mutate(
      { userId: tempUserId, code: totpCode },
      {
        onSuccess: (data) => {
          if (data.success) {
            toastService.success("Verification successful!");
            router.push("/dashboard");
          }
        },
        onError: (err: any) => {
          toastService.error(
            err.response?.data?.error || "Verification failed",
          );
        },
      },
    );
  };

  if (show2FA) {
    return (
      <div className="sm:max-w-7xl min-h-screen px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-10 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div
            className={`${
              isDarkMode
                ? "bg-white/6 backdrop-blur border border-white/8"
                : "bg-black/6 backdrop-blur border border-black/8"
            } rounded-2xl p-8 shadow-sm mr-auto ml-auto`}
          >
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 text-blue-500">
                <Lock size={24} />
              </div>
              <h2 className="text-center text-xl font-medium">
                Verification Required
              </h2>
              <p className="text-sm text-gray-400 text-center mt-2">
                Enter the code from your authenticator app
              </p>
            </div>

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full text-center text-3xl tracking-[1em] font-mono py-3 border rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500"
                  value={totpCode}
                  onChange={(e) =>
                    setTotpCode(e.target.value.replace(/\D/g, ""))
                  }
                />
              </div>
              <button
                type="submit"
                disabled={totpCode.length !== 6 || verify2FAMutation.isPending}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {verify2FAMutation.isPending
                  ? "Verifying..."
                  : "Verify & Sign In"}
              </button>
              <button
                type="button"
                onClick={() => setShow2FA(false)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-400 transition-colors"
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:max-w-7xl min-h-screen px-4 sm:px-6 lg:px-8 flex flex-col justify-center pb-10 ">
      <div className="sm:mx-auto  sm:w-full ">
        <h2 className="text-center text-xl font-medium ">
          Sign in to your account
        </h2>
      </div>
      <div
        className={`${
          isDarkMode
            ? "bg-white/6 backdrop-blur border border-white/8"
            : "bg-black/6 backdrop-blur border border-black/8"
        } mt-2 rounded-2xl sm:mx-auto sm:w-full sm:max-w-md`}
      >
        <div className=" py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email or Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-xs text-red-500">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </form.Field>
            <form.Field name="password">
              {(field) => (
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium "
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <div className="flex pr-2 items-center justify-between mt-1 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                      <input
                        id="password"
                        name="password"
                        type={see ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />

                      <span
                        onClick={() => setSee(!see)}
                        className="cursor-pointer ml-2"
                      >
                        {see ? <Eye /> : <EyeClosed />}
                      </span>
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-xs text-red-500">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </form.Field>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm ">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loginMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 rounded-full bg-white text-gray-500">
                  Or{" "}
                  <Link
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    create a new account
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
