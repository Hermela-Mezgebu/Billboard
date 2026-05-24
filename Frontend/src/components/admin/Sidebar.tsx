import React from "react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  CalendarCheck,
  Settings,
  Users,
  LogOut,
  ChevronRight,
  Clock,
  BarChart3,
  MessageSquare,
  Newspaper,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";

export type SubView =
  | "overview"
  | "inventory"
  | "submissions"
  | "orders"
  | "analytics"
  | "messenger"
  | "content"
  | "operators"
  | "adminUsers"   // ✅ FIX: added separate state
  | "settings";

interface SidebarProps {
  activeView: SubView;
  setActiveView: (view: SubView) => void;
  onExit: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  onExit,
  isOpen = true,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static z-50 inset-y-0 left-0 w-72 bg-white dark:bg-brand-bg border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex flex-col h-full">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <div
              onClick={() => setActiveView("overview")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <LayoutDashboard size={22} />
              </div>
              <div>
                <h1 className="text-lg font-black">BillBox</h1>
                <p className="text-[10px] text-slate-400 uppercase">
                  Admin Panel
                </p>
              </div>
            </div>

            {onClose && (
              <button onClick={onClose} className="lg:hidden">
                <X size={20} />
              </button>
            )}
          </div>

          {/* NAV */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">

            <NavSection title="Operations">
              <NavItem
                icon={<LayoutDashboard size={18} />}
                label="Dashboard"
                active={activeView === "overview"}
                onClick={() => setActiveView("overview")}
              />
              <NavItem
                icon={<ImageIcon size={18} />}
                label="Billboards"
                active={activeView === "inventory"}
                onClick={() => setActiveView("inventory")}
              />
              <NavItem
                icon={<Clock size={18} />}
                label="Approvals"
                active={activeView === "submissions"}
                onClick={() => setActiveView("submissions")}
              />
              <NavItem
                icon={<CalendarCheck size={18} />}
                label="Orders"
                active={activeView === "orders"}
                onClick={() => setActiveView("orders")}
              />
            </NavSection>

            <NavSection title="Growth">
              <NavItem
                icon={<BarChart3 size={18} />}
                label="Analytics"
                active={activeView === "analytics"}
                onClick={() => setActiveView("analytics")}
              />
              <NavItem
                icon={<MessageSquare size={18} />}
                label="Messenger"
                active={activeView === "messenger"}
                onClick={() => setActiveView("messenger")}
              />
              <NavItem
                icon={<Newspaper size={18} />}
                label="Content"
                active={activeView === "content"}
                onClick={() => setActiveView("content")}
              />
            </NavSection>

            <NavSection title="System">
              <NavItem
                icon={<Users size={18} />}
                label="Users"
                active={activeView === "operators"}
                onClick={() => setActiveView("operators")}
              />

              {/* ✅ FIXED: separate admin users */}
              <NavItem
                icon={<Users size={18} />}
                label="Admin Users"
                active={activeView === "adminUsers"}
                onClick={() => setActiveView("adminUsers")}
              />

              <NavItem
                icon={<Settings size={18} />}
                label="Settings"
                active={activeView === "settings"}
                onClick={() => setActiveView("settings")}
              />
            </NavSection>
          </div>

          {/* FOOTER */}
          <div className="pt-6 border-t">
            <button
              onClick={onExit}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function NavSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase text-slate-400 font-bold mb-3 px-2">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition",
        active
          ? "bg-indigo-600 text-white shadow"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {active && <ChevronRight size={14} />}
    </button>
  );
}