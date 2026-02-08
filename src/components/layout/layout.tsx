"use client";
import type React from "react";
import { Suspense } from "react";
import Loading from "@/app/loading";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";
import PageTransition from "@/components/ui/PageTransition";
import { ThemeProvider } from "@/hooks/ThemeChanger";
import AppProviders from "@/lib/provider/AppProvider";
import ToastProvider from "@/lib/provider/ToastProvider";

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Apna Campus",
  description:
    "The official Learning Management System for Apna Campus Institute.",
  url: "https://apna-campus.netlify.app", // Replace with actual domain
  logo: "https://apna-campus.netlify.app/logo/apna-campus-logo.png", // Replace with actual logo URL
  sameAs: ["https://twitter.com/apna-campus", "https://github.com/apna-campus"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <StructuredData data={organizationStructuredData} />
        <Suspense fallback={<Loading />}>
          <GoogleAnalytics />
        </Suspense>
        <script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="c3924214-275c-42e2-9630-5f5b92def79b"
          type="text/javascript"
          async
        ></script>
      </head>
      <body
        className={`transition-all duration-300 antialiased bg-slate-50 dark:bg-[#081015]`}
        suppressHydrationWarning
      >
        <AppProviders>
          <PageTransition>
            <ThemeProvider>
              <ToastProvider />
              {children}
            </ThemeProvider>
          </PageTransition>
        </AppProviders>
      </body>
    </>
  );
}
