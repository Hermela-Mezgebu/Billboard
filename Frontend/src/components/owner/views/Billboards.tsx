"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { createBillboard, getOwnerBillboards } from "@/lib/api"; // ✅ FIXED

interface Billboard {
  id: number;
  title: string;
  location: string;
  image?: string;
  description?: string;
  screenSize?: string;
  status?: string;
  type?: string;
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
    type: "",
  });

  const normalizeBillboard = (b: any): Billboard => ({
    id: b.id,
    title: b.title,
    location: b.location,
    image: b.image
      ? `http://127.0.0.1:8000/storage/${b.image}`
      : "/placeholder.jpg",
    description: b.description || "",
    screenSize: b.screen_size || "",
    status: b.status || "pending",
    type: b.type || "",
  });

  const loadBillboards = useCallback(async () => {
    try {
      const res = await getOwnerBillboards(); // ✅ FIXED HERE

      if (!Array.isArray(res)) {
        setList([]);
        return;
      }

      const normalized = res.map(normalizeBillboard);
      setList(normalized);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBillboards();

    const handleFocus = () => loadBillboards();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [loadBillboards]);

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

  const handleUpload = async () => {
    if (
      !form.title ||
      !form.location ||
      !form.description ||
      !form.screenSize ||
      !form.duration ||
      !form.type ||
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
      formData.append("type", form.type);
      formData.append("screen_size", form.screenSize);
      formData.append(
        "price",
        String(getPriceFromDuration(form.duration))
      );
      formData.append("status", "pending");
      formData.append("media", media);

      const res = await createBillboard(formData);
      const newItem = normalizeBillboard(res);

      setList((prev) => [newItem, ...prev]);

      await loadBillboards();

      alert("✅ Sent to admin for approval");

      setForm({
        title: "",
        location: "",
        description: "",
        screenSize: "",
        duration: "",
        type: "",
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

        <label className="h-40 w-full bg-slate-800 rounded-xl mb-4 flex items-center justify-center cursor-pointer">
          {media ? (
            <img
              src={URL.createObjectURL(media)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-slate-400 text-sm">
              <Upload className="mx-auto mb-2" />
              Upload Image
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
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-800"
        />

        <textarea
          value={form.description}
          placeholder="Description"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-800"
        />

        <input
          value={form.location}
          placeholder="Location"
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-800"
        />

        <input
          value={form.screenSize}
          placeholder="Screen Size (4x2m)"
          onChange={(e) =>
            setForm({ ...form, screenSize: e.target.value })
          }
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-800"
        />

        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
          className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-800"
        >
          <option value="">Select Type</option>
          <option value="digital">Digital</option>
          <option value="smart">Smart</option>
          <option value="premium">Premium</option>
          <option value="static">Static</option>
        </select>

        <select
          value={form.duration}
          onChange={(e) =>
            setForm({ ...form, duration: e.target.value })
          }
          className="w-full mb-4 px-4 py-2 rounded-lg bg-slate-800"
        >
          <option value="">Select Duration</option>
          <option value="1_day">1 Day</option>
          <option value="1_week">1 Week</option>
          <option value="1_month">1 Month</option>
        </select>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 py-3 rounded-xl"
        >
          {uploading ? "Uploading..." : "Upload Billboard"}
        </button>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-3 gap-6">
        {list.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl overflow-hidden">
            <img src={b.image} className="h-40 w-full object-cover" />

            <div className="p-5">
              <h4>{b.title}</h4>
              <p className="text-xs text-gray-500">{b.location}</p>

              <p className="text-xs mt-1 text-blue-500">
                {b.type}
              </p>

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