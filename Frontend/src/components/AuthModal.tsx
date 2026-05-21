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
  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState(""); // ✅ NEW

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedRole = searchParams.get("role") || "client";

  const toggleMode = () =>
    setMode(mode === "login" ? "signup" : "login");

  // AUTO OPEN
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
              name,
              email,
              password,
              role: selectedRole,
              license_number:
                selectedRole === "owner" ? licenseNumber : null, // ✅ FIX
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
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // REDIRECT
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
          <motion.div className="relative flex h-[650px] w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-50 p-2 text-gray-400"
            >
              <X size={20} />
            </button>

            <div className="flex w-full">

              {/* LEFT */}
              <div className="hidden w-1/2 bg-indigo-600 p-12 md:flex flex-col justify-center items-center">
                <Rocket size={48} />
                <h2 className="text-3xl font-bold mt-4">
                  Welcome to Billbox
                </h2>
              </div>

              {/* RIGHT */}
              <div className="flex w-full flex-col justify-center px-8 py-10 md:w-1/2">

                <h3 className="text-2xl font-bold mb-6 text-center">
                  {mode === "signup" ? "Create Account" : "Login"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {mode === "signup" && (
                    <>
                      <input
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-800 p-3 rounded-xl"
                      />

                      {/* ✅ ONLY FOR OWNER */}
                      {selectedRole === "owner" && (
                        <input
                          placeholder="License Number"
                          value={licenseNumber}
                          onChange={(e) =>
                            setLicenseNumber(e.target.value)
                          }
                          className="w-full bg-slate-800 p-3 rounded-xl"
                        />
                      )}
                    </>
                  )}

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 p-3 rounded-xl"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 p-3 rounded-xl"
                  />

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button className="w-full bg-indigo-600 py-3 rounded-xl">
                    {loading ? "Loading..." : "Submit"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm">
                  {mode === "signup"
                    ? "Already have an account?"
                    : "No account?"}{" "}
                  <button
                    onClick={toggleMode}
                    className="text-indigo-400 font-bold"
                  >
                    {mode === "signup" ? "Login" : "Signup"}
                  </button>
                </p>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}