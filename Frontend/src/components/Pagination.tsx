import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo, useEffect } from 'react';
import { Billboard } from '@/types';

interface PaginationProps {
  billboards?: Billboard[];
  onChange?: (data: Billboard[]) => void;
}

export function Pagination({ billboards = [], onChange }: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ✅ TOTAL PAGES
  const totalPages = Math.max(1, Math.ceil(billboards.length / itemsPerPage));

  // ✅ CURRENT PAGE DATA (PURE)
  const currentData = useMemo(() => {
    return billboards.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [billboards, currentPage]);

  // ✅ SIDE EFFECT (CORRECT PLACE)
  useEffect(() => {
    if (onChange) {
      onChange(currentData);
    }
  }, [currentData, onChange]);

  // ✅ HANDLERS
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  };

  // ✅ GENERATE PAGES
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2 pb-20">

      {/* PREVIOUS */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>

   <div className="flex gap-1 items-center">
  {currentPage > 2 && <span>...</span>}

  {Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((page) => page >= currentPage - 1 && page <= currentPage + 1)
    .map((page) => (
      <button
        key={page}
        onClick={() => goToPage(page)}
        className={cn(
          "h-10 w-10 rounded-lg text-sm font-semibold",
          page === currentPage
            ? "bg-indigo-600 text-white"
            : "text-slate-600 hover:bg-slate-100"
        )}
      >
        {page}
      </button>
    ))}

  {currentPage < totalPages - 1 && <span>...</span>}
</div>

      {/* NEXT */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}