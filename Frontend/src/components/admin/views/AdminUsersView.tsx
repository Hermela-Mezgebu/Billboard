"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Trash,
  Shield,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  getAdmins,
  createAdmin,
  deleteAdmin,
  toggleAdminStatus
} from "@/lib/api";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  active: boolean;
}

export function AdminUsersView() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN" as "ADMIN" | "SUPER_ADMIN"
  });

  // ✅ LOAD ADMINS
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data || []);
    } catch (err) {
      console.error("Admins error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATE ADMIN
  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) return;

    try {
      const newAdmin = await createAdmin(form);

      setAdmins(prev => [newAdmin, ...prev]);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "ADMIN"
      });

    } catch (err) {
      console.error("Create admin error:", err);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id: string) => {
    await deleteAdmin(id);
    setAdmins(prev => prev.filter(a => a.id !== id));
  };

  // ✅ TOGGLE ACTIVE
  const handleToggle = async (id: string) => {
    const updated = await toggleAdminStatus(id);

    setAdmins(prev =>
      prev.map(a => (a.id === id ? updated : a))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-black dark:text-white">
          Admin Management
        </h2>
        <p className="text-slate-500 text-sm">
          Super admin can manage system operators
        </p>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white dark:bg-brand-card p-6 rounded-2xl border space-y-4">
        <div className="flex items-center gap-2 font-black">
          <Plus size={18} /> Add New Admin
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="input"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="input"
          />

          <select
            value={form.role}
            onChange={e =>
              setForm({ ...form, role: e.target.value as any })
            }
            className="input"
          >
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold"
        >
          Create Admin
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white dark:bg-brand-card rounded-2xl border overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-400">Loading...</p>
        ) : admins.length === 0 ? (
          <p className="p-6 text-slate-400">No admins yet</p>
        ) : (
          admins.map(admin => (
            <div
              key={admin.id}
              className="flex items-center justify-between p-6 border-b"
            >
              <div>
                <h4 className="font-black">{admin.name}</h4>
                <p className="text-sm text-slate-500">
                  {admin.email}
                </p>
              </div>

              <div className="flex items-center gap-6">

                {/* ROLE */}
                <span className={cn(
                  "text-xs px-3 py-1 rounded-full font-bold",
                  admin.role === "SUPER_ADMIN"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-slate-100 text-slate-600"
                )}>
                  {admin.role}
                </span>

                {/* ACTIVE */}
                <button onClick={() => handleToggle(admin.id)}>
                  <UserCheck
                    className={cn(
                      admin.active
                        ? "text-green-600"
                        : "text-slate-300"
                    )}
                  />
                </button>

                {/* DELETE */}
                <button onClick={() => handleDelete(admin.id)}>
                  <Trash className="text-red-500" />
                </button>

              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}