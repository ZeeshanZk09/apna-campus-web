"use client";

import { ArrowLeft, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  backHref?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  backHref,
  actions,
  children,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {backHref && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(backHref)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black tracking-tight dark:text-white sm:text-3xl">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
