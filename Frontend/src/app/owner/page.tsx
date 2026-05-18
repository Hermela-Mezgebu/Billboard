"use client";

import { useState } from "react";
import OwnerSidebar, { OwnerSubView  } from "@/components/owner/OwnerSidebar";

import Dashboard from "@/components/owner/views/Dashboard";
import Billboards from "@/components/owner/views/Billboards";
import Submissions from "@/components/owner/views/Submissions";
import Orders from "@/components/owner/views/Orders";
import Earnings from "@/components/owner/views/Earnings";
import Settings from "@/components/owner/views/Settings";

export default function OwnerPage() {
  const [activeView, setActiveView] = useState<OwnerSubView>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleExit = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return <Dashboard />;
      case "billboards":
        return <Billboards />;
      case "submissions":
        return <Submissions />;
      case "orders":
        return <Orders />;
      case "earnings":
        return <Earnings />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-black">
      {/* SIDEBAR */}
      <OwnerSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onExit={handleExit}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}