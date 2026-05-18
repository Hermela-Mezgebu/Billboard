"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Save,
  Settings as SettingsIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ API (you will create this in /lib/api)
import { getSettings, updateSettings } from "@/lib/api";

interface SettingsData {
  name: string;
  email: string;
  password?: string;

  systemName: string;
  currency: string;

  notifications: boolean;
  maintenance: boolean;
}

export function SettingsView() {
  const [data, setData] = useState<SettingsData>({
    name: "",
    email: "",
    password: "",
    systemName: "",
    currency: "USD",
    notifications: true,
    maintenance: false
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ LOAD SETTINGS
  useEffect(() => {
    async function load() {
      try {
        const res = await getSettings();

        setData({
          name: res?.name ?? "",
          email: res?.email ?? "",
          password: "",
          systemName: res?.systemName ?? "Billboard System",
          currency: res?.currency ?? "USD",
          notifications: res?.notifications ?? true,
          maintenance: res?.maintenance ?? false
        });

      } catch (err) {
        console.error("Settings load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ✅ HANDLE CHANGE
  const updateField = (key: keyof SettingsData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // ✅ SAVE
  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess(false);

      await updateSettings(data);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-black dark:text-white uppercase tracking-tight">
          Platform Settings
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage system configuration and admin preferences
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading settings...</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">

          {/* PROFILE */}
          <div className="bg-white dark:bg-brand-card rounded-3xl p-8 border shadow-sm space-y-6">
            <SectionTitle icon={<User size={18} />} title="Admin Profile" />

            <Input
  label="Full Name"
  value={data.name ?? ""}
  onChange={(v) => updateField("name", v)}
/>

            <Input
              label="Email Address"
              value={data.email ?? ""}
              onChange={(v) => updateField("email", v)}
            />

            <Input
              label="New Password"
              type="password"
              value={data.password ?? ""}
              onChange={(v) => updateField("password", v)}
            />
          </div>

          {/* SYSTEM */}
          <div className="bg-white dark:bg-brand-card rounded-3xl p-8 border shadow-sm space-y-6">
            <SectionTitle icon={<SettingsIcon size={18} />} title="System Config" />

            <Input
              label="System Name"
              value={data.systemName ?? ""}
              onChange={(v) => updateField("systemName", v)}
            />

            <Input
              label="Currency"
              value={data.currency ?? ""}
              onChange={(v) => updateField("currency", v)}
            />

            <Toggle
              label="Enable Notifications"
              checked={data.notifications}
              onChange={(v) => updateField("notifications", v)}
            />

            <Toggle
              label="Maintenance Mode"
              checked={data.maintenance}
              onChange={(v) => updateField("maintenance", v)}
            />
          </div>
        </div>
      )}

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 transition-all",
            saving
              ? "bg-slate-300 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          )}
        >
          <Save size={16} />
          {saving ? "Saving..." : success ? "Saved!" : "Save Changes"}
        </button>
      </div>

    </motion.div>
  );
}

/* ================= UI COMPONENTS ================= */

function SectionTitle({ icon, title }: any) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>
      <h4 className="font-black text-sm uppercase tracking-wide">{title}</h4>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-400 uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-xl border bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-600"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm font-medium">{label}</span>

      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "w-12 h-6 rounded-full transition-all",
          checked ? "bg-indigo-600" : "bg-slate-300"
        )}
      >
        <div
          className={cn(
            "h-6 w-6 bg-white rounded-full shadow transform transition-all",
            checked ? "translate-x-6" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}