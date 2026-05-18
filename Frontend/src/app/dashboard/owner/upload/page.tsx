"use client";

import { useState } from "react";
import axios from "axios";

export default function UploadBillboard() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    screen_size: "",
    duration: "",
    price: "",
    type: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (file) formData.append("media", file);

    try {
      await axios.post("http://127.0.0.1:8000/api/billboards", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Uploaded! Waiting for admin approval");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 space-y-4">
      <input placeholder="Title" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <input placeholder="Screen Size" onChange={(e) => setForm({ ...form, screen_size: e.target.value })} />
      <input placeholder="Duration" onChange={(e) => setForm({ ...form, duration: e.target.value })} />
      <input placeholder="Price" onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <input placeholder="Type" onChange={(e) => setForm({ ...form, type: e.target.value })} />

      <textarea placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <button onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-2">
        Upload Billboard
      </button>
    </div>
  );
}