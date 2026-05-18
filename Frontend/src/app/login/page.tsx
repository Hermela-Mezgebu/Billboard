"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Info, AlertCircle, Loader2 } from "lucide-react";
import { authService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setRole } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roleSelection, setRoleSelection] = useState<"client" | "owner">(
    "client",
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 🔐 LOGIN (SQLite backend)
  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authService.login({
        email: form.email,
        password: form.password,
      });

      const user = res.data.user;

      // 🔒 Optional: ensure role matches selection
      if (user.role !== roleSelection) {
        setError("Selected role does not match your account.");
        setLoading(false);
        return;
      }

      // ✅ Store in AuthContext and localStorage
      setUser(user);
      setRole(user.role);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.data.token);

      // 🚀 Redirect based on role
      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "owner") {
        router.push("/owner");
      } else if (user.role === "client") {
        router.push("/client");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-xl border">
      {/* 🧠 Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-neutral-500">
          Login to manage your billboard experience
        </p>
      </div>

      {/* 👤 Role Selection */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-4 p-1 bg-neutral-100 rounded-xl">
          <button
            onClick={() => setRoleSelection("client")}
            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition ${
              roleSelection === "client"
                ? "bg-white shadow text-blue-600"
                : "text-neutral-500"
            }`}
          >
            Advertiser
          </button>

          <button
            onClick={() => setRoleSelection("owner")}
            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition ${
              roleSelection === "owner"
                ? "bg-white shadow text-blue-600"
                : "text-neutral-500"
            }`}
          >
            Owner
          </button>
        </div>

        {/* ℹ️ Info */}
        <div className="flex gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg text-xs">
          <Info className="w-4 h-4" />
          <p>
            {roleSelection === "client"
              ? "Browse and book billboard ads easily."
              : "Manage your billboards and earnings."}
          </p>
        </div>
      </div>

      {/* 📧 Email */}
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-4 p-3 border rounded-xl"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* 🔑 Password */}
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-4 p-3 border rounded-xl"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* ❌ Error */}
      {error && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* 🔐 Login Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        onClick={handleLogin}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Login
          </>
        )}
      </motion.button>

      {/* 🔗 Signup */}
      <p className="text-center text-sm text-neutral-500 mt-6">
        Don’t have an account?{" "}
        <span
          onClick={() => router.push("/choose-role")}
          className="text-blue-600 cursor-pointer font-semibold"
        >
          Sign up
        </span>
      </p>
    </div>
  );
}
