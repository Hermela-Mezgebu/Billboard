import React from 'react';
import { motion } from 'framer-motion';
import Billboards from '../Billboards';
import { Plus } from 'lucide-react';

interface InventoryViewProps {
  onCreate?: () => void;
  onSelectBillboard?: (id: string) => void;
}

export function InventoryView({
  onCreate,
  onSelectBillboard,
}: InventoryViewProps) {

  // ✅ Handle selection (real logic hook)
  const handleSelect = (id: string) => {
    if (onSelectBillboard) {
      onSelectBillboard(id);
    } else {
      console.log("Selected billboard:", id);
      // future: route to detail page
      // router.push(`/admin/billboards/${id}`)
    }
  };

  // ✅ Handle create button
  const handleCreate = () => {
    if (onCreate) {
      onCreate();
    } else {
      console.log("Open create billboard modal");
      // future: open modal / navigate
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
            Billboard Fleet
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Real-time status of all digital and static network assets
          </p>
        </div>

        {/* ✅ Now functional */}
        <button
          onClick={handleCreate}
          className="h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:rotate-1 transition-all flex items-center gap-3"
        >
          <Plus size={20} />
          New Deployment
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white dark:bg-brand-card rounded-[3rem] p-4 lg:p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
        
        {/* ✅ REAL connection to data-driven component */}
        <Billboards onSelect={handleSelect} />

      </div>
    </motion.div>
  );
}