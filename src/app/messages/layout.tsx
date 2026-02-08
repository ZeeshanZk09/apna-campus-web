// src/app/messages/layout.tsx
import type React from "react";
import ProtectedRoute from "@/components/ui/ProtectedRoute";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-[calc(100vh-80px)] overflow-hidden bg-gray-50 dark:bg-gray-950">
        {children}
      </div>
    </ProtectedRoute>
  );
}
