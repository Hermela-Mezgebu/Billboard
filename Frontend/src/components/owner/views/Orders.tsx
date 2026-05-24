"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  MapPin,
  ExternalLink
} from "lucide-react";
import { cn } from "../../../lib/utils";

/* ================= TYPES ================= */
interface Order {
  id: string;
  client: string;
  item: string;
  type: string;
  duration: string;
  income: number;
  status: "Live" | "Upcoming" | "Completed";
  date: string;
  progress: number;
}

/* ================= API ================= */
async function getOwnerOrders(token: string | null): Promise<Order[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/owner/orders", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token || ""}`, // ✅ FIXED
      },
      cache: "no-store", // ✅ CRITICAL FIX
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("API ERROR:", text);
      return [];
    }

    const data = await res.json();

    return Array.isArray(data)
      ? data.map((o: any) => ({
          id: o.id ?? "N/A",
          client: o.client_name ?? "Unknown",
          item: o.billboard_name ?? "Unknown Site",
          type: o.type ?? "Static",
          duration: o.duration ?? "N/A",
          income: Number(o.amount ?? 0),
          status: o.status ?? "Upcoming",
          date: o.start_date ?? "N/A",
          progress: Number(o.progress ?? 0),
        }))
      : [];
  } catch (err) {
    console.error("Orders fetch error:", err);
    return [];
  }
}

/* ================= COMPONENT ================= */
export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    live: 0,
    pending: 0,
    reach: 0,
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    async function load() {
      setLoading(true);

      const data = await getOwnerOrders(token);

      setOrders(data);

      /* ✅ CALCULATE REAL STATS */
      const live = data.filter(o => o.status === "Live").length;
      const pending = data.filter(o => o.status === "Upcoming").length;

      const reach = data.reduce((acc, o) => acc + o.progress * 1000, 0);

      setStats({
        live,
        pending,
        reach,
      });

      setLoading(false);
    }

    load();
  }, [token]); // ✅ re-run if token changes

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
            Campaign Console
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Active rentals and upcoming reservations
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Live Campaigns"
          value={stats.live.toString()}
          sub="Active now"
          color="text-indigo-600"
        />
        <StatCard
          label="Pending Starts"
          value={stats.pending.toString()}
          sub="Upcoming bookings"
          color="text-amber-600"
        />
        <StatCard
          label="Network Reach"
          value={`${(stats.reach / 1000000).toFixed(1)}M`}
          sub="Estimated impressions"
          color="text-green-600"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-brand-card rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">

        <div className="p-8 border-b flex items-center justify-between">
          <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">
            Master Ledger
          </span>
          <ShoppingBag size={20} className="text-slate-300" />
        </div>

        <div className="flex-grow overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase">Client</th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase">Billboard</th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase">Progress</th>
                <th className="p-8 text-[10px] font-black text-slate-400 uppercase">Revenue</th>
                <th className="p-8"></th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td className="p-8 text-slate-400 text-sm">Loading...</td>
                </tr>
              )}

              {!loading && orders.length === 0 && (
                <tr>
                  <td className="p-8 text-slate-400 text-sm">
                    No orders found
                  </td>
                </tr>
              )}

              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-slate-50 transition">

                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-indigo-600">
                        {order.client.charAt(0)}
                      </div>

                      <div>
                        <h4 className="text-sm font-black uppercase">
                          {order.client}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {order.id} • {order.date}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-xs font-black uppercase">
                        {order.item}
                      </span>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className="w-full max-w-[120px] space-y-2">
                      <div className="flex justify-between text-[9px]">
                        <span className={cn(
                          order.status === "Live"
                            ? "text-green-500"
                            : "text-slate-400"
                        )}>
                          {order.status}
                        </span>
                        <span>{order.progress}%</span>
                      </div>

                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${order.progress}%` }}
                          className={cn(
                            "h-full",
                            order.status === "Live"
                              ? "bg-green-500"
                              : "bg-slate-300"
                          )}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-8">
                    <span className="text-sm font-black text-indigo-600">
                      ${order.income.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {order.duration}
                    </p>
                  </td>

                  <td className="p-8 text-right">
                    <button className="h-12 w-12 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600">
                      <ExternalLink size={20} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-brand-card p-8 rounded-[2.5rem] border shadow-sm">
      <p className="text-[10px] text-slate-400 uppercase mb-2">{label}</p>
      <h4 className={cn("text-3xl font-black", color)}>{value}</h4>
      <p className="text-[10px] text-slate-500">{sub}</p>
    </div>
  );
}