"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import NotificationBell from "@/components/NotificationBell";
import Link from "next/link";
interface NavbarProps {
  onOpenAuth: (mode: "login" | "signup" | "role") => void;
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export function Navbar({ onOpenAuth, onNavigate, currentPage }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);
 const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [user, setUser] = useState<{ name: string; email: string }>({
    name: "User",
    email: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ LOAD USER
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);

      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || "User",
          email: parsed.email || "",
        });
      } catch {
        setUser({ name: "User", email: "" });
      }
    } else {
      setIsLoggedIn(false);
      setUser({ name: "User", email: "" });
    }
  }, []);

  // ✅ DARK MODE
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // ✅ UPDATE CART COUNT WHEN TAB FOCUSED
useEffect(() => {
  const handleFocus = () => {
    const stored = localStorage.getItem("cart");
    const cart = stored ? JSON.parse(stored) : [];
    setCartCount(cart.length);
  };

  window.addEventListener("focus", handleFocus);

  return () => window.removeEventListener("focus", handleFocus);
}, []);

  // ✅ LOAD CART COUNT
useEffect(() => {
  const updateCart = () => {
    const stored = localStorage.getItem("cart");
    const cart = stored ? JSON.parse(stored) : [];
    setCartCount(cart.length);
  };

  updateCart();

  // ✅ listen for cart changes (important for real-time update)
  window.addEventListener("storage", updateCart);

  return () => window.removeEventListener("storage", updateCart);
}, []);

  // ✅ INITIALS
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    setUser({ name: "User", email: "" });
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", id: "" },
    { name: "Billboards", id: "billboards" },
    { name: "Blogs", id: "blog" },
    { name: "Services", id: "services" },
    { name: "About", id: "about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-brand-bg/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate("home")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg">
            <LayoutDashboard size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            SeekSonic
          </span>
        </div>

        {/* NAV LINKS */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => onNavigate(link.id)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400",
                currentPage === link.id
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <button className="hidden lg:block p-2 hover:bg-slate-100 rounded-full">
            <Search size={20} />
          </button>

          {/* DARK MODE */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* 🔔 NOTIFICATION */}
          {isLoggedIn && <NotificationBell />}

          {/* CART */}
          <Link href="/cart">
            <div className="flex items-center gap-1 text-sm">
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {/* PROFILE OR AUTH */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black">
                  {getInitials(user.name)}
                </div>

                <ChevronDown
                  size={14}
                  className={cn(
                    "text-slate-400",
                    isProfileOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-56 p-2 bg-white dark:bg-brand-card border rounded-2xl shadow-xl"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate("settings");
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-100"
                    >
                      <Settings size={16} />
                      Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={() => onOpenAuth("signup")}
                className="border px-4 py-2 rounded-md"
              >
                Sign Up
              </button>

              <button
                onClick={() => onOpenAuth("login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Sign In
              </button>
            </div>
          )}

          {/* MOBILE MENU */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}