"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  Filter,
  MapPin,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOrders } from "@/lib/api";

interface Order {
  id: string;
  client: string;
  item: string;
  type: string;
  duration: string;
  amount: number;
  status: string;
  date: string;
}

export function OrdersView() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ✅ FETCH REAL DATA
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders();

        const mapped: Order[] = (data || []).map((o: any) => ({
          id: String(o.id ?? `ORD-${Math.floor(Math.random() * 9999)}`),
          client: o.clientName ?? "Unknown Client",
          item: o.billboard?.location ?? "Unknown Location",
          type: o.billboard?.type ?? "Static",
          duration: `${o.duration ?? 1} Months`,
          amount: Number(o.totalPrice ?? 0),
          status: o.status ?? "Pending",
          date: o.createdAt
            ? new Date(o.createdAt).toLocaleDateString()
            : "-"
        }));

        setOrders(mapped);
        setFiltered(mapped);

      } catch (err) {
        console.error("Orders fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // ✅ FILTER + SEARCH
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "All") {
      result = result.filter(o => o.status === statusFilter);
    }

    if (search) {
      result = result.filter(o =>
        o.client.toLowerCase().includes(search.toLowerCase()) ||
        o.item.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, orders, statusFilter]);

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
            Order Lifecycle
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Manage campaigns, bookings, and revenue flow
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="bg-white dark:bg-brand-card border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600 w-64 lg:w-80"
            />
          </div>

          <button className="h-14 w-14 flex items-center justify-center bg-white dark:bg-brand-card border rounded-2xl text-slate-500 hover:text-indigo-600">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white dark:bg-brand-card rounded-[2.5rem] border shadow-xl overflow-hidden">

        {/* FILTER TABS */}
        <div className="p-6 border-b flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-6">
            {["All", "Active", "Pending", "Completed"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "text-sm font-black uppercase pb-2 transition-all",
                  statusFilter === status
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-400 hover:text-slate-900"
                )}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-slate-400 uppercase">
            {filtered.length} Results
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/30">
                <th className="p-6 text-xs text-slate-400 uppercase">Order</th>
                <th className="p-6 text-xs text-slate-400 uppercase">Client</th>
                <th className="p-6 text-xs text-slate-400 uppercase">Asset</th>
                <th className="p-6 text-xs text-slate-400 uppercase">Value</th>
                <th className="p-6 text-xs text-slate-400 uppercase">Status</th>
                <th className="p-6"></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="p-6">
                      <div className="h-4 bg-slate-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <p className="text-slate-400 text-sm">
                      No orders found
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="border-b hover:bg-slate-50/30 group">

                    {/* ID */}
                    <td className="p-6">
                      <div className="text-xs font-black">{order.id}</div>
                      <div className="text-[10px] text-slate-400">{order.date}</div>
                    </td>

                    {/* CLIENT */}
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <ShoppingBag size={16} />
                        </div>
                        <span className="text-sm font-bold">{order.client}</span>
                      </div>
                    </td>

                    {/* ASSET */}
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span className="text-sm font-medium">{order.item}</span>
                      </div>
                      <span className="text-xs text-slate-400">{order.type}</span>
                    </td>

                    {/* VALUE */}
                    <td className="p-6">
                      <div className="font-black">{formatCurrency(order.amount)}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {order.duration}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-6">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black",
                        order.status === 'Active' && "bg-green-100 text-green-600",
                        order.status === 'Pending' && "bg-amber-100 text-amber-600",
                        order.status === 'Completed' && "bg-slate-100 text-slate-600",
                        order.status === 'Review' && "bg-indigo-100 text-indigo-600"
                      )}>
                        {order.status === 'Active' && <CheckCircle2 size={12} />}
                        {order.status === 'Pending' && <Clock size={12} />}
                        {order.status === 'Review' && <AlertCircle size={12} />}
                        {order.status}
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="p-6 text-right opacity-0 group-hover:opacity-100 transition">
                      <button className="p-2 text-slate-400 hover:text-slate-900">
                        <MoreVertical size={18} />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </motion.div>
  );
}