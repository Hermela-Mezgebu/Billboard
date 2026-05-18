"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleSelect = (role: "owner" | "client") => {
    // ✅ redirect with role + trigger signup modal
    router.push(`/?role=${role}&auth=signup`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl"
      >
        {/* TITLE */}
        <h2 className="text-4xl font-serif text-white text-center mb-16">
          Which Describes You?
        </h2>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* OWNER */}
          <RoleCard
            title="Owner"
            icon={<Building2 size={48} />}
            description="I own billboard spaces and want to rent them."
            onClick={() => handleSelect("owner")}
          />

          {/* CLIENT */}
          <RoleCard
            title="Client"
            icon={<User size={48} />}
            description="I want to rent billboard spaces for advertising."
            onClick={() => handleSelect("client")}
          />
        </div>

        {/* BACK */}
        <button
          onClick={() => router.push("/")}
          className="mt-12 mx-auto block text-slate-500 hover:text-white transition text-sm font-bold uppercase tracking-widest"
        >
          Back to Website
        </button>
      </motion.div>
    </div>
  );
}

/* 🔥 ROLE CARD COMPONENT */
function RoleCard({
  title,
  icon,
  description,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "group cursor-pointer relative rounded-3xl bg-slate-900/60 p-12 border border-slate-800 transition-all",
        "hover:border-indigo-500/60 hover:bg-slate-900 shadow-2xl"
      )}
    >
      <div className="flex flex-col items-center text-center">
        {/* ICON */}
        <div className="mb-8 relative">
          <div className="h-32 w-32 rounded-full bg-slate-950 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition shadow-inner">
            {icon}
          </div>

          <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />
        </div>

        {/* TITLE */}
        <h3 className="text-3xl font-serif text-indigo-400 mb-6 group-hover:text-indigo-300">
          {title}
        </h3>

        {/* DESCRIPTION */}
        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
          <p className="text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}