"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Download,
  CreditCard,
  Building
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

import { cn } from "../../../lib/utils";

/* TYPES */
type ChartItem = {
  month: string;
  revenue: number;
};

type Transaction = {
  id: string;
  billboard: string;
  amount: string;
  method: string;
  status: "Completed" | "Processing";
  date: string;
};

export default function Earnings() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH DATA
  const loadEarnings = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/owner/earnings", {
        headers: {
          Accept: "application/json"
        }
      });

      const data = await res.json();

      // ✅ SAFE FALLBACKS
      setTransactions(Array.isArray(data?.transactions) ? data.transactions : []);
      setChartData(Array.isArray(data?.chart) ? data.chart : []);
      setBalance(Number(data?.balance ?? 0));

    } catch (err) {
      console.error("Earnings fetch error:", err);

      // fallback to empty instead of crash
      setTransactions([]);
      setChartData([]);
      setBalance(0);

    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ AUTO REFRESH FIX
  useEffect(() => {
    loadEarnings();

    const handleFocus = () => loadEarnings();
    window.addEventListener("focus", handleFocus);

    const interval = setInterval(loadEarnings, 15000); // refresh every 15s

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [loadEarnings]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-10 pb-20"
    >

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black dark:text-white uppercase tracking-tighter">
            Revenue Vault
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Historical payouts and projected earnings
          </p>
        </div>

        <button className="h-14 px-8 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center gap-3">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="space-y-6">

          {/* BALANCE */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
            <p className="text-[10px] uppercase text-indigo-200 font-black">
              Withdrawable Balance
            </p>

            <h3 className="text-5xl font-black mt-2">
              {loading ? "..." : `$${balance.toLocaleString()}`}
            </h3>

            <div className="mt-6 text-xs flex items-center gap-2 text-indigo-100">
              <Clock size={14} /> Live updates
            </div>

            <button className="mt-8 w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-2">
              <CreditCard size={16} />
              Withdraw
            </button>
          </div>

          {/* GOALS (UNCHANGED) */}
          <div className="bg-white dark:bg-brand-card rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow">
            <h3 className="text-sm font-black uppercase mb-6">
              Earnings Goals
            </h3>

            <div className="space-y-6">
              <RevenueGoal label="Bole Hub" target={12000} current={balance} color="bg-indigo-600" />
              <RevenueGoal label="Piyasa" target={5000} current={balance / 2} color="bg-green-500" />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">

          {/* CHART */}
          <div className="bg-white dark:bg-brand-card rounded-[2.5rem] p-8 border shadow">
            <div className="flex justify-between mb-6">
              <h3 className="font-black uppercase">Revenue Trends</h3>
              <div className="text-green-500 text-xs flex items-center gap-1">
                <TrendingUp size={14} /> Live
              </div>
            </div>

            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;

                      const value = payload[0]?.value as number | undefined;

                      return (
                        <div className="bg-black text-white p-3 rounded-xl text-xs">
                          <p>{payload[0]?.payload?.month}</p>
                          <p className="font-bold">
                            ${value ? value.toLocaleString() : 0}
                          </p>
                        </div>
                      );
                    }}
                  />

                  <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i === chartData.length - 1 ? "#4F46E5" : "#CBD5F5"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white dark:bg-brand-card rounded-[2.5rem] border shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between">
              <h3 className="font-black uppercase">Payout History</h3>
              <Building className="text-slate-300" />
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-slate-400 uppercase">
                  <th className="p-4">Billboard</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-t hover:bg-slate-50">
                    <td className="p-4">
                      <p className="font-bold">{tx.billboard}</p>
                      <p className="text-xs text-slate-400">{tx.date}</p>
                    </td>

                    <td className="p-4 font-bold">
                      {tx.amount}
                    </td>

                    <td className="p-4 text-xs uppercase">
                      {tx.method}
                    </td>

                    <td className="p-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        tx.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-amber-100 text-amber-600"
                      )}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

        </div>
      </div>
    </motion.div>
  );
}

/* GOAL COMPONENT */
function RevenueGoal({
  label,
  target,
  current,
  color
}: {
  label: string;
  target: number;
  current: number;
  color: string;
}) {

  const percent = Math.min((current / target) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="font-bold">{label}</span>
        <span>${current} / ${target}</span>
      </div>

      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}