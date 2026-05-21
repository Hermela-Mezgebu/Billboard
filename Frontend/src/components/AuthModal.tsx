"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Rocket } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup" | "role";
  setMode: (mode: "login" | "signup" | "role") => void;
}

export function AuthModal({
  isOpen,
  onClose,
  mode,
  setMode,
}: AuthModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const selectedRole = searchParams.get("role") || "client";

  const toggleMode = () =>
    setMode(mode === "login" ? "signup" : "login");

  
  // ✅ AUTO OPEN FROM URL
  useEffect(() => {
    const auth = searchParams.get("auth");

    if (auth === "signup") setMode("signup");
    if (auth === "login") setMode("login");
  }, [searchParams, setMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url =
        mode === "signup"
          ? "http://127.0.0.1:8000/api/register"
          : "http://127.0.0.1:8000/api/login";

 const body =
  mode === "signup"
    ? {
        name, // ✅ REAL NAME
        email,
        password,
        role: selectedRole,
      }
    : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

    let data;

try {
  data = await res.json();
} catch {
  const text = await res.text();
  console.error("NOT JSON:", text);
  alert("Server returned invalid response");
  return;
}

      if (!res.ok) {
        throw new Error(data.message || "Failed");
      }

    if (data.token) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user)); // ✅ REQUIRED
}

      // ✅ ROLE BASED REDIRECT
      if (selectedRole === "owner") {
        window.location.href = "/owner";
      } else {
        window.location.href = "/client";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
          />

          {/* MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative flex h-[650px] w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl"
          >

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-50 rounded-full p-2 text-gray-400 hover:bg-slate-800"
            >
              <X size={20} />
            </button>

            <div className="flex w-full flex-col md:flex-row">

              {/* LEFT */}
              <motion.div
                animate={{
                  x: mode === "signup" ? "0%" : "100%",
                }}
                className="hidden w-1/2 flex-col items-center justify-center bg-indigo-600 p-12 md:flex"
              >
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/20">
                  <Rocket size={48} />
                </div>

                <h2 className="mb-4 text-3xl font-bold">
                  Welcome to Billbox
                </h2>

                <p className="text-indigo-100 text-center">
                  {mode === "signup"
                    ? "Create your account to unlock premium features."
                    : "Welcome back!"}
                </p>
              </motion.div>

              {/* RIGHT */}
              <motion.div
                animate={{
                  x: mode === "signup" ? "0%" : "-100%",
                }}
                className="flex w-full flex-col justify-center px-8 py-10 md:w-1/2"
              >

                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold">
                    {mode === "signup"
                      ? "Create your account"
                      : "Welcome Back"}
                  </h3>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  {mode === "signup" && (
  <input
    placeholder="Full Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full rounded-xl border border-gray-700 bg-slate-800 px-4 py-2"
  />
)}

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-slate-800 px-4 py-2"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-slate-800 px-4 py-2"
                  />

                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}

                  <button className="w-full bg-indigo-600 py-3 rounded-xl">
                    {loading ? "Loading..." : "Submit"}
                  </button>
                </form>

                {/* SOCIAL */}
                <div className="mt-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="h-px flex-1 bg-gray-600" />
                    OR
                    <div className="h-px flex-1 bg-gray-600" />
                  </div>

                  <div className="mt-4 flex justify-center gap-4">
                    {/* GOOGLE */}
                    <button className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png"
                        className="h-6 w-6"
                      />
                    </button>

                    {/* FACEBOOK */}
                    <SocialButton
                      icon={<FaFacebookF />}
                      color="bg-blue-600"
                    />
                  </div>
                </div>

                {/* SWITCH */}
                <p className="mt-6 text-center text-sm">
                  {mode === "signup"
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <button
                    onClick={() => {
                      if (mode === "login") {
                        router.push("/choose-role"); // ✅ FIXED
                      } else {
                        toggleMode();
                      }
                    }}
                    className="font-bold text-indigo-400"
                  >
                    {mode === "signup" ? "Sign In" : "Sign Up"}
                  </button>
                </p>

              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SocialButton({
  icon,
  color,
}: {
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <button
      className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${color}`}
    >
      {icon}
    </button>
  );
}