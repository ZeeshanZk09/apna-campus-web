"use client";
import dynamic from "next/dynamic";
import type React from "react";
import { useHydrationFix } from "@/lib/utils/HydrationFix";

export default function Bg({ children }: { children: React.ReactNode }) {
  const DynamicBackground = dynamic(() => import("./Background"), {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #e6f0ff, #cfe2ff)",
        }}
      />
    ),
  });

  const isHydrated = useHydrationFix(100);

  if (!isHydrated) return null;

  return <DynamicBackground>{children}</DynamicBackground>;
}
