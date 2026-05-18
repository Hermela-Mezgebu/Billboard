"use client";

import { useEffect, useState } from "react";
import { billboardService } from "@/services/api";
import { Billboard } from "@/types";
import { Shield, Check, X, Loader2, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [pending, setPending] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  // 🔄 Fetch pending billboards from backend (SQLite)
  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await billboardService.getPending(); // API call
      setPending(res.data);
    } catch (err) {
      setError("Failed to load billboards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // ✅ Approve / Reject
  const handleAction = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setActionLoading(id);
      await billboardService.updateStatus(id, status);

      // 🔄 Refresh list after action
      await fetchPending();
    } catch (err) {
      setError("Action failed. Try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500">
          Loading pending billboards...
        </p>
      </div>
    );
  }

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
      <div className="bg-neutral-900 text-white p-10 rounded-[40px] flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4">
            <Shield className="w-10 h-10 text-blue-500" />
            Admin Panel
          </h1>
          <p className="text-white/60 mt-2 font-medium">
            Review and approve billboard listings
          </p>
        </div>

        <div className="text-right">
          <p className="text-5xl font-black text-blue-500">
            {pending.length}
          </p>
          <p className="text-xs uppercase tracking-widest opacity-50">
            Pending Reviews
          </p>
        </div>
      </div>

      {/* 📦 List */}
      <div className="grid grid-cols-1 gap-4">
        {pending.length === 0 ? (
          <div className="py-20 text-center bg-white border rounded-[32px] text-neutral-400 font-medium shadow-sm">
            ✅ All good! No pending billboard approvals.
          </div>
        ) : (
          pending.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-[32px] border flex items-center gap-6 hover:shadow-xl transition-all"
            >
              {/* 🖼 Image */}
              <img
                src={b.images?.[0] || "/placeholder.jpg"}
                className="w-24 h-24 rounded-2xl object-cover border"
              />

              {/* 📍 Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {b.location}
                </h3>

                <p className="text-sm text-neutral-500 mb-2">
                  {b.size} • ETB{" "}
                  {Number(b.pricePerDay).toLocaleString()}/day
                </p>

                <span className="px-2 py-1 bg-neutral-100 rounded text-xs font-bold text-neutral-500">
                  ID: {b.id.slice(0, 8)}
                </span>
              </div>

              {/* ⚙️ Actions */}
              <div className="flex gap-3">
                <button
                  disabled={actionLoading === b.id}
                  onClick={() => handleAction(b.id, "approved")}
                  className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition disabled:opacity-50"
                >
                  {actionLoading === b.id ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Check className="w-6 h-6" />
                  )}
                </button>

                <button
                  disabled={actionLoading === b.id}
                  onClick={() => handleAction(b.id, "rejected")}
                  className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition disabled:opacity-50"
                >
                  {actionLoading === b.id ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <X className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}