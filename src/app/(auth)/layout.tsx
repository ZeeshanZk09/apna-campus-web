// src/app/(auth)/layout.tsx
import DynamicBackground from "@/components/ui/Bg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DynamicBackground>
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </DynamicBackground>
  );
}
