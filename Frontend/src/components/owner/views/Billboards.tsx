"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { createBillboard, getBillboards } from "@/lib/api";

interface Billboard {
  id: number;
  title: string;
  location: string;
  image: string;
  description?: string;
  screenSize?: string;
  status?: string;
}

export default function Billboards() {
  const [list, setList] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [media, setMedia] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    screenSize: "",
    duration: "",
  });

  // ✅ NORMALIZE
  const normalizeBillboard = (b: any): Billboard => ({
    id: b.id,
    title: b.title,
    location: b.location,
    image:
      b.image ||
      b.image_url ||
      (Array.isArray(b.images) ? b.images[0] : "") ||
      "/placeholder.jpg",
    description: b.description || "",
    screenSize: b.type || "", // 🔥 FIX
    status: b.status || "pending",
  });

  // ✅ LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBillboards();
        const normalized = Array.isArray(res)
          ? res.map(normalizeBillboard)
          : [];
        setList(normalized);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 🔥 CONVERT DURATION → PRICE
  const getPriceFromDuration = (duration: string) => {
    switch (duration) {
      case "1_day":
        return 100;
      case "1_week":
        return 500;
      case "1_month":
        return 1500;
      default:
        return 0;
    }
  };

  // ✅ HANDLE UPLOAD
  const handleUpload = async () => {
    if (
      !form.title ||
      !form.location ||
      !form.description ||
      !form.screenSize ||
      !form.duration ||
      !media
    ) {
      alert("Fill all fields");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("location", form.location);
      formData.append("description", form.description);

      // 🔥 IMPORTANT FIXES
      formData.append("type", form.screenSize); // backend expects type
      formData.append("price", String(getPriceFromDuration(form.duration)));
      formData.append("status", "pending"); // ✅ SET STATUS TO PENDING
      formData.append("media", media);

      const res = await createBillboard(formData);

      const newItem = normalizeBillboard(res);

      setList((prev) => [newItem, ...prev]);

      alert(
        "✅ Billboard submitted! Waiting for admin approval. You'll be notified once it's approved.",
      );

      setForm({
        title: "",
        location: "",
        description: "",
        screenSize: "",
        duration: "",
      });
      setMedia(null);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div className="space-y-10">
      {/* FORM */}
      <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-700 text-white max-w-md">
        <label className="h-40 w-full bg-slate-800 rounded-xl overflow-hidden mb-4 flex items-center justify-center cursor-pointer">
          {media ? (
            media.type.startsWith("video") ? (
              <video
                src={URL.createObjectURL(media)}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
              />
            ) : (
              <img
                src={URL.createObjectURL(media)}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="text-center text-slate-400 text-sm">
              <Upload className="mx-auto mb-2" />
              Click to upload Image / Video
            </div>
          )}

          <input
            type="file"
            onChange={(e) => setMedia(e.target.files?.[0] || null)}
            className="hidden"
          />
        </label>

        <input
          value={form.title}
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-800 text-sm"
        />

        <textarea
          value={form.description}
          placeholder="Description"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-800 text-sm"
        />

        <input
          value={form.screenSize}
          placeholder="Screen Size (4 x 2m)"
          onChange={(e) => setForm({ ...form, screenSize: e.target.value })}
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-800 text-sm"
        />

        <input
          value={form.location}
          placeholder="Location"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-800 text-sm"
        />

        <select
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-800 text-sm"
        >
          <option value="">Select Duration</option>
          <option value="1_day">1 Day</option>
          <option value="1_week">1 Week</option>
          <option value="1_month">1 Month</option>
        </select>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 py-3 rounded-xl font-semibold"
        >
          {uploading ? "Uploading..." : "Upload Billboard"}
        </button>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-3 gap-6">
        {list.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-brand-card rounded-2xl overflow-hidden"
          >
            <img src={b.image} className="h-40 w-full object-cover" />

            <div className="p-5 space-y-2">
              <h4>{b.title}</h4>
              <p className="text-xs text-slate-400">{b.location}</p>

              <span
                className={`text-xs font-bold ${
                  b.status === "approved"
                    ? "text-green-500"
                    : b.status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                }`}
              >
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
