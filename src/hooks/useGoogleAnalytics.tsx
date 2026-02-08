"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useGoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load gtag script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", process.env.NEXT_PUBLIC_GA_ID);
  }, []);

  useEffect(() => {
    // Track page views
    if (typeof window !== "undefined" && (window as any).gtag) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);
};
