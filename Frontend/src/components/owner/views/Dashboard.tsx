"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Eye,
  DollarSign,
  Calendar
} from "lucide-react";

import AdminCard from "../../admin/AdminCard";
import { getOwnerDashboard } from "@/lib/api";

// ✅ TYPES
interface DashboardData {
  reach: number;
  leads: number;
  payouts: number;
  rank: number;
  bookings: number[];
  nextVacancy?: {
    location: string;
    date: string;
  };
  interactions: {
    user: string;
    msg: string;
    time: string;
  }[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    reach: 0,
    leads: 0,
    payouts: 0,
    rank: 0,
    bookings: [],
    interactions: []
  });

  const [loading, setLoading] = useState(true);

  // ✅ FETCH REAL DATA
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOwnerDashboard();

        setData({
          reach: Number(res?.reach ?? 0),
          leads: Number(res?.leads ?? 0),
          payouts: Number(res?.payouts ?? 0),
          rank: Number(res?.rank ?? 0),
          bookings: Array.isArray(res?.bookings) ? res.bookings : [],
          nextVacancy: res?.nextVacancy ?? undefined,
          interactions: Array.isArray(res?.interactions)
            ? res.interactions
            : []
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ✅ HELPERS
  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M+";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K+";
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-4xl font-black dark:text-white uppercase tracking-tight">
          Market Visibility
        </h2>
        <p className="text-slate-500 mt-2">
          Real-time performance of your billboard inventory
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminCard
          icon={<Eye size={22} />}
          label="Total Reach"
          value={loading ? "..." : formatNumber(data.reach)}
          trend="+Live"
          trendPositive
        />

        <AdminCard
          icon={<Users size={22} />}
          label="Client Leads"
          value={loading ? "..." : data.leads.toString()}
          trend="+Live"
          trendPositive
        />

        <AdminCard
          icon={<DollarSign size={22} />}
          label="Total Payouts"
          value={
            loading
              ? "..."
              : `$${data.payouts.toLocaleString()}`
          }
          trend="+Revenue"
          trendPositive
        />

        <AdminCard
          icon={<TrendingUp size={22} />}
          label="Network Rank"
          value={loading ? "..." : `#${data.rank}`}
          trend={data.rank <= 5 ? "Top" : "Growing"}
          trendPositive={data.rank <= 5}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* CALENDAR */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-card rounded-[2rem] p-8 border shadow-sm">
          <h3 className="text-xl font-bold dark:text-white">
            Booking Schedule
          </h3>
          <p className="text-sm text-slate-500">
            Your booked billboard dates
          </p>

          <div className="mt-8 grid grid-cols-7 gap-3">
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const booked = data.bookings.includes(day);

              return (
                <div
                  key={i}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition ${
                    booked
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* NEXT VACANCY */}
          <div className="mt-6 flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <Calendar className="text-indigo-600" />
            <div>
              <p className="text-xs text-slate-400 uppercase">
                Next Vacancy
              </p>
              <p className="font-bold dark:text-white">
                {data.nextVacancy
                  ? `${data.nextVacancy.location} • ${data.nextVacancy.date}`
                  : "No upcoming vacancy"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* BOOST */}
          <div className="bg-indigo-600 text-white rounded-2xl p-6">
            <h3 className="font-bold text-lg">
              Improve Performance
            </h3>
            <p className="text-sm mt-2 text-indigo-100">
              Upload better billboard images to increase bookings.
            </p>

            <button className="mt-4 w-full bg-white text-indigo-600 py-2 rounded-lg font-bold text-sm">
              Upload Media
            </button>
          </div>

          {/* INTERACTIONS */}
          <div className="bg-white dark:bg-brand-card rounded-2xl p-6 border shadow-sm">
            <h3 className="font-bold mb-4 dark:text-white">
              Recent Activity
            </h3>

            {loading && (
              <p className="text-sm text-slate-400">
                Loading...
              </p>
            )}

            {!loading && data.interactions.length === 0 && (
              <p className="text-sm text-slate-400">
                No activity yet
              </p>
            )}

            <div className="space-y-4">
              {data.interactions.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold">
                    {item.user?.[0] || "U"}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold dark:text-white">
                      {item.user}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {item.msg}
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}