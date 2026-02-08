"use client";

import { Calendar as CalendarIcon, ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";

interface AttendanceFiltersProps {
  cohorts: any[];
  selectedCohortId?: string;
  selectedDate: Date;
}

export default function AttendanceFilters({
  cohorts,
  selectedCohortId,
  selectedDate,
}: AttendanceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("date", e.target.value);
    router.push(`/admin/academics/attendance?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <CalendarIcon size={16} /> Select Date
        </h2>
        <input
          type="date"
          defaultValue={selectedDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
          className="w-full bg-muted/50 border-none rounded-2xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary transition-all text-sm"
        />
      </div>

      <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <Users size={16} /> Select Cohort
        </h2>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {cohorts.map((cohort) => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set("cohortId", cohort.id);
            const href = `/admin/academics/attendance?${params.toString()}`;
            const isActive = selectedCohortId === cohort.id;

            return (
              <Link
                key={cohort.id}
                href={href}
                className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all ${isActive ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" : "bg-muted/30 border-transparent hover:border-border"}`}
              >
                <div className="text-left">
                  <p className="text-sm font-bold truncate max-w-[150px]">
                    {cohort.name}
                  </p>
                  <p className="text-[10px] opacity-70 truncate max-w-[150px]">
                    {cohort.program?.name || "No Program"}
                  </p>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
