import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Pagination() {
  const pages = [1, 2, 3, 4, 5];
  const activePage = 3;

  return (
    <div className="mt-12 flex items-center justify-center gap-2 pb-20">
      <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800">
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>

      <div className="flex gap-1">
        {pages.map((page) => (
          <button
            key={page}
            className={cn(
              "h-10 w-10 rounded-lg text-sm font-semibold transition-all",
              page === activePage
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800">
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
