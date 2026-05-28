"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      alert("Reset link sent to your email");
    } catch (err) {
      console.error(err);
      alert("Error sending email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-white text-2xl mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded bg-slate-700 text-white mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 py-3 rounded text-white"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}