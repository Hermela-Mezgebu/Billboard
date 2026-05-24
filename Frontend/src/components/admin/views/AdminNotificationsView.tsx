"use client";

import { useEffect, useState } from "react";
import { getNotifications } from "@/lib/api";

interface Notification {
  id: number;
  message: string;
  type: string;
  created_at: string;
}

export default function AdminNotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();

      // ✅ FIX 1: HANDLE BOTH API FORMATS
      let data: Notification[] = [];

      if (Array.isArray(res)) {
        data = res;
      } else if (res?.data && Array.isArray(res.data)) {
        data = res.data;
      } else {
        console.error("Unexpected notifications format:", res);
        data = [];
      }

      // ✅ FIX 2: SORT NEWEST FIRST (optional but good)
      data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );

      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
      setNotifications([]); // ✅ SAFE FALLBACK
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">🔔 Notifications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-slate-800 p-4 rounded-xl border border-slate-700"
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    n.type === "approval"
                      ? "bg-green-600"
                      : n.type === "rejection"
                      ? "bg-red-600"
                      : "bg-indigo-600" // ✅ NEW: submission type
                  }`}
                >
                  {n.type}
                </span>

                <span className="text-xs text-gray-400">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>

              <p className="mt-2">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}