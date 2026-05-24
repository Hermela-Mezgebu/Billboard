import React from 'react';
import {
  LayoutDashboard,
  Image as ImageIcon,
  CalendarCheck,
  Settings,
  DollarSign,
  LogOut,
  ChevronRight,
  Clock,
  PlusCircle,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

export type OwnerSubView =
  | 'overview'
  | 'billboards'
  | 'submissions'
  | 'orders'
  | 'earnings'
  | 'settings';

interface OwnerSidebarProps {
  activeView: OwnerSubView;
  setActiveView: (view: OwnerSubView) => void;
  onExit: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function OwnerSidebar({
  activeView,
  setActiveView,
  onExit,
  isOpen = true,
  onClose
}: OwnerSidebarProps) {

  // 🔥 FORCE CHANGE HANDLER (IMPORTANT FIX)
  const handleChange = (view: OwnerSubView) => {
    if (view === activeView) return;

    // force re-render cycle
    setTimeout(() => {
      setActiveView(view);
    }, 0);

    if (onClose) onClose(); // mobile close
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-brand-bg border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform lg:static lg:translate-x-0 flex flex-col shadow-2xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={onExit}
            >
              <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 group-hover:rotate-12 transition-all">
                <PlusCircle size={28} />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none block uppercase tracking-tighter">
                  Owner<span className="text-indigo-600">Hub</span>
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Partner Portal
                </span>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            )}
          </div>

          <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-8 scrollbar-hide">

            {/* Inventory */}
            <div>
              <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Inventory
              </p>
              <nav className="space-y-1">
                <NavItem active={activeView === 'overview'} onClick={() => handleChange('overview')} icon={<LayoutDashboard size={18} />} label="Performance" />
                <NavItem active={activeView === 'billboards'} onClick={() => handleChange('billboards')} icon={<ImageIcon size={18} />} label="My Billboards" />
                <NavItem active={activeView === 'submissions'} onClick={() => handleChange('submissions')} icon={<Clock size={18} />} label="Pending Posts" />
              </nav>
            </div>

            {/* Revenue */}
            <div>
              <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Revenue
              </p>
              <nav className="space-y-1">
                <NavItem active={activeView === 'earnings'} onClick={() => handleChange('earnings')} icon={<DollarSign size={18} />} label="Earnings Wrap" />
                <NavItem active={activeView === 'orders'} onClick={() => handleChange('orders')} icon={<CalendarCheck size={18} />} label="Live Orders" />
              </nav>
            </div>

            {/* Profile */}
            <div>
              <p className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Profile
              </p>
              <nav className="space-y-1">
                <NavItem active={activeView === 'settings'} onClick={() => handleChange('settings')} icon={<Settings size={18} />} label="Hub Settings" />
              </nav>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onExit}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 transition-all group"
            >
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-all">
                <LogOut size={20} />
              </div>
              <span className="font-black text-sm uppercase tracking-tight">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-sm transition-all group",
        active
          ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 translate-x-2"
          : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
      )}
    >
      <span
        className={cn(
          "transition-transform group-hover:scale-110",
          active
            ? "text-white"
            : "text-slate-400 group-hover:text-indigo-600"
        )}
      >
        {icon}
      </span>
      <span className="uppercase tracking-tight">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );
}