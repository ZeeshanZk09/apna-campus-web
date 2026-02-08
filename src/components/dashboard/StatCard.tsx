import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

const colorMap: Record<string, string> = {
  "bg-blue-600": "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
  "bg-emerald-600": "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30",
  "bg-emerald-500": "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30",
  "bg-purple-600": "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
  "bg-rose-500": "bg-rose-100 text-rose-600 dark:bg-rose-900/30",
  "bg-amber-500": "bg-amber-100 text-amber-600 dark:bg-amber-900/30",
  "bg-indigo-500": "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30",
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: StatCardProps) {
  const iconClasses =
    colorMap[color] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800";

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${iconClasses}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
        {trend && (
          <p className="text-[10px] text-emerald-600 font-bold mt-1">{trend}</p>
        )}
      </div>
    </div>
  );
}
