"use client";

import { BookOpen, CreditCard, GraduationCap, Users } from "lucide-react";
import type React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  colorClass = "text-indigo-600",
}: StatsCardProps) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
          {title}
        </p>
        <h3 className="text-3xl font-black mt-1 text-gray-900 dark:text-white">
          {value}
        </h3>
      </div>
      <div
        className={`p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl ${colorClass}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

interface AdminStatsProps {
  stats: {
    studentCount: number;
    courseCount: number;
    activeCohorts: number;
    pendingInvoices: number;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StatsCard
        title="Students"
        value={stats.studentCount}
        icon={<Users size={24} />}
        colorClass="text-blue-500"
      />
      <StatsCard
        title="Courses"
        value={stats.courseCount}
        icon={<BookOpen size={24} />}
        colorClass="text-indigo-500"
      />
      <StatsCard
        title="Batches"
        value={stats.activeCohorts}
        icon={<GraduationCap size={24} />}
        colorClass="text-emerald-500"
      />
      <StatsCard
        title="Pending Fees"
        value={stats.pendingInvoices}
        icon={<CreditCard size={24} />}
        colorClass="text-amber-500"
      />
    </div>
  );
}
