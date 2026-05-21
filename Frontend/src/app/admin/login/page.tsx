"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
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

    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin/dashboard";
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-10 rounded-2xl w-[350px]">
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>

        <input
          className="w-full mb-4 p-3 rounded bg-slate-800"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 rounded bg-slate-800"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 py-3 rounded font-bold"
        >
          Login
        </button>
      </div>
    </div>
  );
}