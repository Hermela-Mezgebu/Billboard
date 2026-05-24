"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ✅ IMPORTS
import Sidebar, { SubView } from "@/components/admin/Sidebar";

import { Dashboard } from "@/components/admin/views/Dashboard";
import { OrdersView } from "@/components/admin/views/OrdersView";
import { Messenger } from "@/components/admin/views/Messenger";
import { SubmissionsView } from "@/components/admin/views/SubmissionsView";
import { Analytics } from "@/components/admin/views/Analytics";
import { ContentManager } from "@/components/admin/views/ContentManager";
import { SettingsView } from "@/components/admin/views/SettingsView";
import { AdminUsersView } from "@/components/admin/views/AdminUsersView";
import AdminNotificationsView from "@/components/admin/views/AdminNotificationsView";
import Submissions from "@/components/admin/views/Submissions";
export default function AdminPage() {
  const [activeView, setActiveView] = useState<SubView>("overview");
  const router = useRouter();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black">
      
      {/* SIDEBAR */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onExit={() => router.push("/")} // ✅ better navigation
      />

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-8">

        {/* DASHBOARD */}
        {activeView === "overview" && <Dashboard />}

        {/* ORDERS */}
        {activeView === "orders" && <OrdersView />}

        {/* MESSENGER */}
        {activeView === "messenger" && <Messenger />}

        {/* 🔥 SUBMISSIONS (IMPORTANT - YOUR BILLBOARDS APPROVAL PAGE) */}
        {activeView === "submissions" && <SubmissionsView />}

        {/* ANALYTICS */}
        {activeView === "analytics" && <Analytics />}

        {/* CONTENT */}
        {activeView === "content" && <ContentManager />}

        {/* SETTINGS */}
        {activeView === "settings" && <SettingsView />}

        {/* USERS */}
        {activeView === "operators" && <AdminUsersView />}
        
        <AdminNotificationsView />

         <Submissions />
      </div>
    </div>
  );
}