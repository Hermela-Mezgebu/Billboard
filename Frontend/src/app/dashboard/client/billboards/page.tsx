"use client";

import { billboardService } from "@/services/api";
import { Billboard } from "@/types";
import BillboardCard from "@/components/BillboardCard";
import { Search, SlidersHorizontal, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react"; // ✅ FIXED

export default function BillboardsPage() {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // 🔄 Fetch from backend (SQLite API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await billboardService.getPublicBillboards();
        setBillboards(res.data); // ✅ important
      } catch (err) {
        setError("Failed to load billboards");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔍 Filter
  const filtered = billboards.filter((b) =>
    b.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">

      {/* ❌ Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* 🔷 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[32px] border shadow-sm">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Billboards
          </h1>
          <p className="text-neutral-500">
            Discover premium advertising spots
          </p>
        </div>

        {/* 🔍 Search */}
        <div className="flex gap-2">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-600 transition-colors" />

            <input
              type="text"
              placeholder="Filter by location..."
              className="pl-11 pr-6 py-3 bg-neutral-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="p-3 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* ⏳ Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="mt-3 text-gray-500">Loading billboards...</p>
        </div>
      ) : filtered.length === 0 ? (
        // 📭 Empty state
        <div className="py-20 text-center bg-white rounded-[32px] border text-neutral-400 shadow-sm">
          No billboards found for your search.
        </div>
      ) : (
        // 🧩 Grid
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filtered.map((b, index) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <BillboardCard billboard={b} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}