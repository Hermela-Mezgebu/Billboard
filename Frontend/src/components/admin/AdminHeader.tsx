import React from 'react';
import { Search } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-brand-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
      
      <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
        {title}
      </h2>

      <div className="flex items-center gap-6">
        
        {/* SEARCH */}
        <div className="relative hidden sm:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Global search..."
            className="bg-slate-100 dark:bg-slate-900 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all w-64 dark:text-white outline-none"
          />
        </div>

        {/* USER */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold dark:text-white uppercase tracking-tighter">
              System Admin
            </p>
            <p className="text-[10px] font-medium text-slate-400">
              Master Controller
            </p>
          </div>

          <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 border-2 border-indigo-500/20 shadow-inner overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=clamp&w=100"
              alt="Admin avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}