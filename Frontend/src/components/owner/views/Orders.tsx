"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  MoreVertical,
  Clock,
  ImageIcon,
} from "lucide-react";

interface Order {
  id: number;
  client: string;
  billboard: string;
  revenue: number;
  status: string;
  created_at: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://127.0.0.1:8000/api/owner/bookings",
        {
          headers: {
            Authorization: `Bearer ${token || ""}`,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        console.error("API ERROR");
        setOrders([]);
        return;
      }

      const data = await res.json();

      const mapped = data.map((o: any) => ({
        id: o.id,
        client: o.user?.name ?? "Unknown",
        billboard: o.billboard?.title ?? "Unknown",
        revenue: o.total_price ?? 0,
        status: o.status,
        created_at: o.created_at,
      }));

      setOrders(mapped);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= APPROVE ================= */
  const approve = async (id: number) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/owner/bookings/${id}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token || ""}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error("Approve failed");
        return;
      }

      // ✅ instant UI update (no reload)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: "approved" } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= REJECT ================= */
  const reject = async (id: number) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/owner/bookings/${id}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token || ""}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        console.error("Reject failed");
        return;
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: "rejected" } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Campaign Orders
          </h2>
          <p className="text-slate-500 mt-2">
            Manage booking requests from clients
          </p>
        </div>

        <div className="flex px-6 py-4 bg-indigo-50 border rounded-2xl items-center gap-3">
          <History size={18} className="text-indigo-600" />
          <p className="text-xs font-black text-indigo-600 uppercase">
            Live Booking Feed
          </p>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-6">

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border rounded-3xl">
            <h3 className="text-lg font-bold">
              No Orders Found
            </h3>
          </div>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-8 rounded-3xl border shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">

                {/* LEFT */}
                <div className="flex gap-6 items-center">
                  <div className="h-20 w-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <ImageIcon size={32} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      ID-{o.id}
                    </p>

                    <h3 className="text-xl font-bold">
                      {o.billboard}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Client: {o.client}
                    </p>

                    <p className="text-sm font-bold">
                      ${o.revenue}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">

                  {/* STATUS */}
                  <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-xs font-bold">
                    {o.status}
                  </div>

                  {/* ACTIONS */}
                  {o.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approve(o.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(o.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  <button className="h-12 w-12 flex items-center justify-center border rounded-xl text-gray-400">
                    <MoreVertical size={20} />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </motion.div>
  );
}