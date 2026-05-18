import React from 'react';

interface AdminCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  trendPositive?: boolean;
}

export default function AdminCard({
  icon,
  label,
  value,
  trend,
  trendPositive = true,
}: AdminCardProps) {
  return (
    <div className="bg-white dark:bg-brand-card p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/5">
      
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>

        {trend && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg ${
              trendPositive
                ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                : 'text-red-500 bg-red-50 dark:bg-red-900/20'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </p>

      <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
        {value}
      </h4>
    </div>
  );
}