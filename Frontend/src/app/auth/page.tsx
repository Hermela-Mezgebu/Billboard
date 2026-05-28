"use client";

import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [register, setRegister] = useState({
    username: "",
    email: "",
    user_type: "",
    password: "",
    password_confirmation: "",
  });

  // ✅ LOGIN
  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login success");
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // ✅ REGISTER
  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(register),
      });

      const data = await res.json();
      alert("Registered successfully");
      setIsSignIn(true);
    } catch (err) {
      console.error(err);
      alert("Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-6 shadow-lg">
        {/* TABS */}
        <div className="flex mb-6 border-b border-gray-700">
          <button
            onClick={() => setIsSignIn(true)}
            className={`w-1/2 pb-2 ${
              isSignIn ? "border-b-2 border-blue-500 text-white" : "text-gray-400"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => setIsSignIn(false)}
            className={`w-1/2 pb-2 ${
              !isSignIn ? "border-b-2 border-blue-500 text-white" : "text-gray-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* SIGN IN */}
        {isSignIn ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={login.email}
              onChange={(e) =>
                setLogin({ ...login, email: e.target.value })
              }
              className="w-full p-3 rounded bg-gray-700 text-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={login.password}
              onChange={(e) =>
                setLogin({ ...login, password: e.target.value })
              }
              className="w-full p-3 rounded bg-gray-700 text-white"
            />

            <div className="flex justify-between text-sm text-gray-400">
              <span>Remember me</span>
              <Link href="/auth/forgot-password" className="text-blue-400">
                Forgot password?
              </Link>
            </div>

            <button className="w-full bg-indigo-600 py-3 rounded text-white">
              Sign In
            </button>
          </form>
        ) : (
          /* SIGN UP */
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={register.username}
              onChange={(e) =>
                setRegister({ ...register, username: e.target.value })
              }
              className="w-full p-3 rounded bg-gray-700 text-white"
            />

            <select
              value={register.user_type}
              onChange={(e) =>
                setRegister({ ...register, user_type: e.target.value })
              }
              className="w-full p-3 rounded bg-gray-700 text-white"
            >
              <option value="">Select Role</option>
              <option value="2">Client</option>
              <option value="1">Owner</option>
            </select>

            <input
              type="email"
              placeholder="Email"
              value={register.email}
              onChange={(e) =>
                setRegister({ ...register, email: e.target.value })
              }
              className="w-full p-3 rounded bg-gray-700 text-white"
            />

            <input
              type="password"
              placeholder="Password"
              value={register.password}
              onChange={(e) =>
                setRegister({ ...register, password: e.target.value })
              }
              className="w-full p-3 rounded bg-gray-700 text-white"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={register.password_confirmation}
              onChange={(e) =>
                setRegister({
                  ...register,
                  password_confirmation: e.target.value,
                })
              }
              className="w-full p-3 rounded bg-gray-700 text-white"
            />

            <button className="w-full bg-indigo-600 py-3 rounded text-white">
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
}