"use client";

import { useEffect, useState } from "react";
import echo from "@/lib/echo";

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  time?: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  // ✅ FETCH INITIAL
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found");
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("AUTH ERROR:", data);
        return;
      }

      // ✅ ensure array
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  // ✅ LOAD ON START
  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ REAL-TIME LISTENER
  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId || !echo) return;

    const channel = echo.private(`notifications.${userId}`);

    channel.listen(".notification.new", (e: any) => {
      console.log("🔥 NEW NOTIFICATION:", e);

      // ✅ ADD NEW NOTIFICATION TO STATE
      setNotifications((prev) => [
        {
          id: e.id,
          message: e.message,
          is_read: false,
          time: e.time,
        },
        ...prev,
      ]);
    });

    return () => {
      echo.leave(`notifications.${userId}`);
    };
  }, []);

  // ✅ MARK AS READ
  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        `http://127.0.0.1:8000/api/notifications/${id}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("MARK READ ERROR:", err);
    }
  };

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.is_read).length
    : 0;

  return (
    <div className="relative">
      {/* 🔔 BUTTON */}
      <button onClick={() => setOpen(!open)} className="relative text-xl">
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded shadow-lg max-h-96 overflow-auto z-50">
          {notifications.length === 0 && (
            <p className="p-4 text-center">No notifications</p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 border-b cursor-pointer ${
                !n.is_read ? "bg-gray-200" : ""
              }`}
              onClick={() => markAsRead(n.id)}
            >
              <p>{n.message}</p>
              {n.time && (
                <span className="text-xs text-gray-500">{n.time}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}