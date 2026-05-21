"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // ✅ FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  // ✅ AUTO REFRESH (REAL-TIME FEEL)
  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* ICON */}
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell className="text-white" />

        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white text-black rounded-xl shadow-xl p-4 z-50">
          <h4 className="font-bold mb-2">Notifications</h4>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2 border rounded-lg text-sm"
                >
                  {n.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}