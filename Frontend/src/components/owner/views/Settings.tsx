"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  CreditCard,
  ChevronRight,
  Globe,
  Palette
} from "lucide-react";

/* ✅ TYPE */
type Section = {
  id: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  status: string;
};

/* ✅ API CALL */
async function getOwnerSettings() {
  try {
    const res = await fetch("/api/owner/settings"); // 🔁 replace with Laravel endpoint
    return await res.json();
  } catch (err) {
    console.error("Settings fetch error:", err);
    return null;
  }
}

export default function Settings() {

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  /* ✅ FETCH REAL DATA */
  useEffect(() => {
    async function load() {
      const data = await getOwnerSettings();

      setSections([
        {
          id: "profile",
          icon: User,
          title: "Profile Identity",
          desc: "Manage your owner credentials and bio",
          status: data?.profileVerified ? "Verified" : "Incomplete"
        },
        {
          id: "payouts",
          icon: CreditCard,
          title: "Payout Channels",
          desc: "Secure bank and wallet setup",
          status: `${data?.payoutMethods ?? 0} Linked`
        },
        {
          id: "notifs",
          icon: Bell,
          title: "Notification Center",
          desc: "Real-time alerts",
          status: data?.notifications ? "Active" : "Off"
        },
        {
          id: "security",
          icon: Shield,
          title: "Security Protocol",
          desc: "2FA and login protection",
          status: data?.twoFactor ? "High" : "Low"
        },
        {
          id: "region",
          icon: Globe,
          title: "Regional Scope",
          desc: "Timezone and localization",
          status: data?.region ?? "Set"
        },
        {
          id: "aesthetic",
          icon: Palette,
          title: "Portal Aesthetic",
          desc: "Theme & UI customization",
          status: data?.theme ?? "Default"
        }
      ]);

      setLoading(false);
    }

    load();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl space-y-10"
    >

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
            Hub Configuration
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Manage your profile and preferences
          </p>
        </div>

        <div className="bg-indigo-50 px-6 py-3 rounded-2xl flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8px] text-slate-400 uppercase mb-1">
              Account Health
            </p>
            <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full w-[92%] bg-green-500" />
            </div>
          </div>
          <span className="text-xs font-black text-green-600">92%</span>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="grid gap-4">

        {loading && (
          <p className="text-slate-400 text-sm">Loading settings...</p>
        )}

        {!loading && sections.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className="flex items-center gap-6 p-8 bg-white dark:bg-brand-card rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
            >

              {/* ICON */}
              <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Icon size={24} />
              </div>

              {/* TEXT */}
              <div className="grow">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black dark:text-white uppercase">
                    {item.title}
                  </h3>

                  <span className="px-2 py-0.5 rounded-md bg-slate-50 text-[8px] font-black text-slate-400 uppercase">
                    {item.status}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 uppercase mt-2">
                  {item.desc}
                </p>
              </div>

              <ChevronRight className="text-slate-300 group-hover:text-indigo-600" />
            </button>
          );
        })}
      </div>

      {/* API SECTION */}
      <div className="pt-10 border-t border-slate-100">
        <div className="p-10 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <SettingsIcon className="absolute -right-8 -top-8 text-white/10" size={180} />

          <h3 className="text-2xl font-black uppercase">
            Advanced Partner API
          </h3>

          <p className="text-indigo-100 text-sm mt-2 max-w-md">
            Connect your system with our platform using API keys.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs">
              Generate Key
            </button>

            <button className="px-6 py-3 bg-indigo-700 rounded-xl text-xs">
              Docs
            </button>
          </div>
        </div>
      </div>

    </motion.div>
  );
}