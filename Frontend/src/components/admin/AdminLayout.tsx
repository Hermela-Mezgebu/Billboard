import React, { useState } from 'react';
import Sidebar, { SubView }  from './Sidebar';
import AdminHeader  from './AdminHeader';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeView: SubView;
  setActiveView: (view: SubView) => void;
  onExit: () => void;
}

export default function AdminLayout({ children, activeView, setActiveView, onExit }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onExit={onExit}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-grow flex flex-col min-w-0 transition-all">
        <header className="lg:hidden h-16 px-6 flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-bg">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 font-black uppercase text-slate-900 dark:text-white tracking-widest text-sm">Dashboard</span>
        </header>

        <AdminHeader title={activeView} />

        <div className="p-6 lg:p-10 flex-grow overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children} 
          </div>
        </div>
      </main>
    </div>
  );
}
