"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((x) => x);

  return (
    <nav className="flex items-center gap-2 mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 no-scrollbar">
      <Link
        href="/dashboard"
        className="p-2 bg-white dark:bg-slate-900 border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
      >
        <Home size={14} />
      </Link>

      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const name =
          path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

        return (
          <React.Fragment key={path}>
            <ChevronRight
              size={14}
              className="text-muted-foreground flex-shrink-0"
            />
            <Link
              href={href}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                ${
                  isLast
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-white dark:bg-slate-900 border border-border text-muted-foreground hover:border-primary hover:text-primary shadow-sm"
                }
              `}
            >
              {name}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
