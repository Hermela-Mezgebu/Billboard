"use client";

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Image as ImageIcon,
  CalendarCheck,
  Users,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminCard from '../AdminCard';
import { getDashboardStats } from '@/lib/api';

// ✅ TYPES
interface DashboardStats {
  total: number;
  totalValue: number;
  bookings: number;
  clients: number;
  monthly: number[];
  activities: {
    title: string;
    desc: string;
    time: string;
    type?: string;
  }[];
}

// ✅ SKELETON CARD
function SkeletonCard() {
  return (
    <div className="h-28 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
  );
}

export function Dashboard() {

  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    totalValue: 0,
    bookings: 0,
    clients: 0,
    monthly: new Array(12).fill(0), // ✅ always safe
    activities: []
  });

  const [loading, setLoading] = useState(true);

  // ✅ FETCH REAL DATA (PRODUCTION SAFE)
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardStats();

        setStats({
          total: Number(data?.total ?? 0),
          totalValue: Number(data?.totalValue ?? 0),
          bookings: Number(data?.bookings ?? 0),
          clients: Number(data?.clients ?? 0),

          // ✅ always 12 months (fix chart bug)
          monthly:
            Array.isArray(data?.monthly) && data.monthly.length === 12
              ? data.monthly
              : new Array(12).fill(0),

          // ✅ normalize activity data
          activities:
            Array.isArray(data?.activities)
              ? data.activities.map((a: any) => ({
                  title: a?.title ?? "Untitled",
                  desc: a?.desc ?? "No description",
                  time: a?.time ?? "now",
                  type: a?.type ?? "info"
                }))
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black dark:text-white">
            Dashboard Overview
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Real-time metrics and system health monitoring
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <AdminCard
              icon={<DollarSign size={24} />}
              label="Monthly Revenue"
              value={`$${stats.totalValue.toLocaleString()}`}
              trend="+12.5%"
            />

            <AdminCard
              icon={<ImageIcon size={24} />}
              label="Total Inventory"
              value={stats.total.toString()}
              trend="+5"
            />

            <AdminCard
              icon={<CalendarCheck size={24} />}
              label="Active Bookings"
              value={stats.bookings.toString()}
              trend="+18%"
            />

            <AdminCard
              icon={<Users size={24} />}
              label="Active Clients"
              value={stats.clients.toString()}
              trend="+2"
            />
          </>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">

          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold dark:text-white">
                Performance Matrix
              </h3>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">
                Revenue Growth Analysis
              </p>
            </div>
          </div>

          {/* EMPTY STATE */}
          {!loading && stats.monthly.every(v => v === 0) ? (
            <div className="h-72 flex items-center justify-center text-slate-400">
              No chart data available
            </div>
          ) : (
            <div className="h-72 flex items-end gap-3 px-2">

              {stats.monthly.map((h, i) => (
                <div
                  key={i}
                  className="flex-grow flex flex-col justify-end gap-1.5 h-full group relative"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05 }}
                    className="w-full bg-indigo-600/10 rounded-t-xl overflow-hidden"
                  >
                    <div
                      className="w-full bg-indigo-600 rounded-t-xl"
                      style={{ height: '70%' }}
                    />
                  </motion.div>

                  <div className="text-[10px] text-slate-400 text-center mt-2">
                    {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                  </div>

                  {/* TOOLTIP */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    ${Math.round(h * 1000)}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* ACTIVITY FEED */}
        <div className="bg-white dark:bg-brand-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">

          <div className="mb-8">
            <h3 className="text-xl font-bold dark:text-white">
              Pulse Feed
            </h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">
              Global Activity
            </p>
          </div>

          <div className="space-y-6 flex-grow">

            {loading ? (
              <p className="text-slate-400 text-sm">Loading activity...</p>
            ) : stats.activities.length === 0 ? (
              <p className="text-slate-400 text-sm">No recent activity</p>
            ) : (
              stats.activities.map((item, i) => (
                <PulseItem
                  key={i}
                  icon={<Clock className="text-indigo-500" />}
                  title={item.title}
                  desc={item.desc}
                  time={item.time}
                />
              ))
            )}

          </div>

          <button className="mt-8 py-4 w-full bg-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
            View System Logs
            <ArrowUpRight size={16} className="inline ml-2" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}

/* ACTIVITY ITEM */
function PulseItem({
  icon,
  title,
  desc,
  time
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
        {icon}
      </div>

      <div className="grow">
        <h4 className="text-sm font-black text-slate-900 uppercase">
          {title}
        </h4>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>

      <span className="text-[10px] text-slate-400 uppercase">
        {time}
      </span>
    </div>
  );
}