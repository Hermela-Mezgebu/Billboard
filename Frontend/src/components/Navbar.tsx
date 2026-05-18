"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type NavbarProps = {
  onOpenAuth: (mode: "login" | "signup" | "role") => void;
};

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ✅ CHECK LOGIN
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
   window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 backdrop-blur-lg z-50 shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto h-[80px] px-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="text-white font-bold text-xl">
          SeekSonic
        </Link>

        {/* MENU */}
        <ul className="hidden lg:flex space-x-8 text-white text-lg font-medium">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/billboards">Billboards</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/blog">Blogs</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>

        {/* AUTH / PROFILE */}
        <div className="hidden lg:flex space-x-4">

          {!user ? (
            <>
              {/* SIGN UP */}
              <button
                onClick={() => (window.location.href = "/choose-role")}
                className="border px-6 py-2 rounded-md text-gray-200"
              >
                Sign Up
              </button>

              {/* LOGIN */}
              <button
                onClick={() => onOpenAuth("login")}
                className="bg-blue-600 px-6 py-2 rounded-md text-white"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              {/* PROFILE */}
              <Link
                href="/profile"
                className="bg-green-600 px-6 py-2 rounded-md text-white"
              >
                Profile
              </Link>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="bg-red-600 px-6 py-2 rounded-md text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="bg-gray-800 text-white flex flex-col items-center py-6 space-y-4">

          {!user ? (
            <>
              <button
                onClick={() => (window.location.href = "/chosen-role")}
                className="border px-4 py-2"
              >
                Sign Up
              </button>

              <button
                onClick={() => onOpenAuth("login")}
                className="bg-blue-600 px-4 py-2"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <Link href="/profile">Profile</Link>

              <button onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}