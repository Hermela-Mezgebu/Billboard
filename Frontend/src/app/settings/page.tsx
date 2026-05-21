"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // ✅ LOAD USER
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setName(user.name || "");
    setEmail(user.email || "");
  }, []);

  // ✅ IMAGE HANDLER
const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files?.[0]) {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      console.log("BASE64 IMAGE:", reader.result); // 👈 DEBUG
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  }
};

  // ✅ SAVE SETTINGS
const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("name", name);
    form.append("email", email);

    if (password) {
      form.append("password", password);
    }

    if (image) {
      form.append("image", image);
    }

    // 🔥 PUT YOUR FETCH HERE
    const res = await fetch("http://127.0.0.1:8000/api/user/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json", // ✅ VERY IMPORTANT
      },
      body: form,
    });

    // ✅ SAFE JSON PARSE
    let data;
    try {
      data = await res.json();
    } catch {
      const text = await res.text();
      console.error("NOT JSON:", text);
      alert("Server error (not JSON)");
      return;
    }

    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }

    // ✅ UPDATE LOCAL STORAGE
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: data.user.name,
        email: data.user.email,
      })
    );

    alert("Profile updated successfully ✅");

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

  return (
    <div className="max-w-3xl mx-auto pt-16 px-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="bg-gray-900 p-6 rounded-xl space-y-6">

        {/* IMAGE */}
        <div>
          <label className="block mb-2">Profile Image</label>
          <input type="file" onChange={handleImage} />

          {preview && (
            <img
              src={preview}
              className="w-24 h-24 rounded-full mt-3 object-cover"
            />
          )}
        </div>

        {/* NAME */}
        <div>
          <label>Name</label>
          <input
            className="w-full p-3 mt-1 rounded bg-gray-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div>
          <label>Email</label>
          <input
            className="w-full p-3 mt-1 rounded bg-gray-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label>Password</label>
          <input
            type="password"
            className="w-full p-3 mt-1 rounded bg-gray-800"
            placeholder="Leave empty to keep current"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-indigo-700"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}