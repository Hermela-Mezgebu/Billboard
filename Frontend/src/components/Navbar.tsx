import { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  ShoppingCart,
  Bell,
  Moon,
  Sun,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface NavbarProps {
  onOpenAuth: (mode: "login" | "signup" | "role") => void;
  onNavigate: (page: string) => void;
  currentPage?: string;
}

export function Navbar({ onOpenAuth, onNavigate, currentPage }: NavbarProps) {
  const [isDark, setIsDark] = useState(true);
  const [notifications] = useState(2);
  const [cartCount] = useState(4);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

const [user, setUser] = useState<{ name: string; email: string }>({
  name: "User",
  email: ""
});

const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  // ✅ GET INITIALS (Hermela D → HD)
const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (
    parts[0][0].toUpperCase() +
    parts[1][0].toUpperCase() // first + second name ONLY
  );
};

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navLinks = [
    { name: 'Home', id: '' },
    { name: 'Billboards', id: 'billboards' },
    { name: 'Blogs', id: 'blog' },
    { name: 'Services', id: 'services' },
    { name: 'About', id: 'about' },
  ];

  // ✅ LOGOUT FUNCTION
const handleLogout = () => {
  localStorage.clear(); // 🔥 clear everything

  setUser({ name: "User", email: "" });
  setIsLoggedIn(false);

  window.location.href = "/";
};

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-brand-bg/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg">
            <LayoutDashboard size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
            SeekSonic
          </span>
        </div>

        {/* Desktop Nav */}
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

         {isLoggedIn && (
  <>
    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
      <span>Notifications</span>
      {notifications > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
          {notifications}
        </span>
      )}
    </div>

    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
      <span>Cart</span>
      {cartCount > 0 && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white">
          {cartCount}
        </span>
      )}
    </div>
  </>
)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:block">
            <Search size={20} />
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* PROFILE */}
 {isLoggedIn ? (
  <div className="relative">
    <button
      onClick={() => setIsProfileOpen(!isProfileOpen)}
      className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black">
        {getInitials(user.name)}
      </div>

      <ChevronDown size={14} className={cn("text-slate-400", isProfileOpen && "rotate-180")} />
    </button>

    <AnimatePresence>
      {isProfileOpen && (
        <motion.div className="absolute right-0 mt-3 w-56 p-2 bg-white dark:bg-brand-card border rounded-2xl shadow-xl">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-bold">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
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
 <div className="mt-4 flex space-x-4">

              <button
                onClick={() => onOpenAuth("signup")}
                className="relative border-2 border-gray-600 text-gray-200 px-6 py-2 rounded-md overflow-hidden group"
              >
                <span className="absolute inset-0 bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition duration-300"></span>
                <span className="relative z-10 group-hover:text-white">
                  Sign Up
                </span>
              </button>

              <button
                onClick={() => onOpenAuth("login")}
                className="bg-blue-600 text-white px-6 py-2 rounded-md relative overflow-hidden group"
              >
                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition duration-500"></span>
                <span className="relative z-10">Sign In</span>
              </button>

            </div>
)}

          {/* Mobile */}
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