"use client";

import { useEffect, useState } from "react";
import { billboardService, bookingService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Billboard, Booking } from "@/types";
import {
  Plus,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  Image as ImageIcon,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

export default function OwnerDashboard() {
  const { user, role } = useAuth();

  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔄 Fetch from API (SQLite backend)
  const fetchData = async () => {
    try {
      if (!user || role !== "owner") return;

      setLoading(true);

      const [billboardRes, bookingRes] = await Promise.all([
        billboardService.getOwnerBillboards(String(user.id)),
        bookingService.getOwnerBookings(String(user.id)),
      ]);

      setBillboards(billboardRes.data);
      setBookings(bookingRes.data);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-3 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* ❌ Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* 🔷 Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black">Owner Dashboard</h1>
          <p className="text-neutral-500 font-medium">
            Manage your advertising portfolio
          </p>
        </div>

        <Link
          href="/owner/add"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Listing
        </Link>
      </header>

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Calendar />}
          label="Active Assets"
          value={billboards.length}
          color="blue"
        />

        <StatCard
          icon={<Clock />}
          label="Pending"
          value={bookings.filter((b) => b.status === "pending").length}
          color="orange"
        />

        <StatCard
          icon={<DollarSign />}
          label="Earnings"
          value={`ETB ${bookings
            .filter((b) => b.status === "approved")
            .reduce((a, c) => a + Number(c.totalPrice), 0)
            .toLocaleString()}`}
          color="green"
        />
      </div>

      {/* 📦 Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 📄 Bookings */}
        <section className="lg:col-span-2 bg-white rounded-[32px] border p-8 shadow-sm">
          <h2 className="text-2xl font-black mb-6">
            Booking Requests
          </h2>

          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 font-medium">
                No booking requests found.
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 rounded-2xl bg-neutral-50 flex items-center justify-between hover:bg-neutral-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-neutral-300" />
                    </div>

                    <div>
                      <p className="font-bold">
                        Req #{booking.id.slice(0, 6)}
                      </p>

                      <p className="text-xs text-neutral-500">
                        {format(new Date(booking.startDate), "MMM d")} -{" "}
                        {format(new Date(booking.endDate), "MMM d")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="font-black text-blue-600 text-sm">
                      ETB {Number(booking.totalPrice).toLocaleString()}
                    </span>

                    <StatusBadge status={booking.status} />

                    <ChevronRight className="w-5 h-5 text-neutral-300" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 🧩 Billboards */}
        <section className="bg-neutral-900 rounded-[32px] p-8 text-white">
          <h2 className="text-2xl font-black mb-6">
            Your Billboards
          </h2>

          <div className="space-y-4">
            {billboards.length === 0 ? (
              <p className="text-white/50 text-sm">
                No billboards added yet.
              </p>
            ) : (
              billboards.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10"
                >
                  <img
                    src={b.images?.[0] || "/placeholder.jpg"}
                    className="w-12 h-12 rounded-xl object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-sm">
                      {b.location}
                    </p>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">
                      {b.size}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "p-1 rounded-full",
                      b.status === "approved"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    )}
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "blue" | "orange" | "green";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border flex items-center gap-4 shadow-sm">
      <div className={cn("p-4 rounded-2xl", colors[color])}>
        {icon}
      </div>

      <div>
        <p className="text-xs uppercase font-bold text-neutral-400 tracking-widest mb-1">
          {label}
        </p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
}) {
  const styles = {
    pending: "bg-orange-100 text-orange-600",
    approved: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-600",
    completed: "bg-blue-100 text-blue-600",
    cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${styles[status]}`}>
      {status}
    </span>
  );
}