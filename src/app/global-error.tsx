"use client";

import { useEffect } from "react";

/**
 * Global error boundary — catches unhandled errors in the app.
 * Displays a user-friendly error screen with retry option.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to external service in production
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              An unexpected error occurred. Please try again.
            </p>
            {error.digest && (
              <p className="text-xs text-gray-400 mb-4">
                Error ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
