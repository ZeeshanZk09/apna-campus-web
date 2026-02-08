"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Error boundary for dashboard routes.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg
            className="w-7 h-7 text-red-500"
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Error
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
          {error.message || "Failed to load this section."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Retry
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
