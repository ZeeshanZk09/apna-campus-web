import type { Metadata } from "next";
import "./globals.css";
import { HeaderForDesktop } from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/ui/PageTransition";
import { ThemeProvider } from "@/hooks/ThemeChanger";
import ThemeButton from "@/components/ui/ThemeButton";
import Background from "@/components/ui/Background";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Apna Campus - potfolio app",
  description: "",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // linear-gradient(to bottom, #f5f9ff, #e6f0ff)
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`transition-all duration-300 antialiased bg-gradient-to-b from-[#f5f9ff] to-[#e6f0ff] dark:bg-[#081015] `}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <PageTransition>
            <Suspense fallback={<Loading />}>
              <Background />
              <HeaderForDesktop />
              {children}
              <ThemeButton />
              <Footer />
            </Suspense>
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
