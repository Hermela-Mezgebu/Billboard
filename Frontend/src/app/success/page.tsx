"use client";

import { CheckCircle, Home, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 px-4">

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
      >

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="bg-green-100 p-4 rounded-full"
          >
            <CheckCircle size={60} className="text-green-500" />
          </motion.div>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-black text-gray-800 dark:text-white">
          Payment Successful 🎉
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-500 dark:text-gray-400 mt-3">
          Your billboard booking has been confirmed successfully.
          You can now manage it from your dashboard.
        </p>

        {/* DIVIDER */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-700" />

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-3">

          {/* DASHBOARD */}
          <button
            onClick={() => router.push("/client")}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            <LayoutDashboard size={18} />
            Go to Dashboard
          </button>

          {/* HOME */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Home size={18} />
            Back to Home
          </button>
        </div>

        {/* FOOTER TEXT */}
        <p className="text-xs text-gray-400 mt-6">
          Thank you for using SeekSonic 🚀
        </p>
      </motion.div>
    </div>
  );
}