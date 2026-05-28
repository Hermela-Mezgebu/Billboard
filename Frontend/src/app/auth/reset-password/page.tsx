"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const token = params.get("token"); // from email link

  const handleReset = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation,
          token,
        }),
      });

      alert("Password reset successful");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-white text-2xl mb-4">Reset Password</h2>

        <input
          placeholder="Email"
          className="w-full p-3 mb-3 rounded bg-slate-700 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 mb-3 rounded bg-slate-700 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-indigo-600 py-3 rounded text-white"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}