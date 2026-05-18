"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  getBillboards,
  createBillboard,
  deleteBillboard,
  updateBillboard,
  Billboard,
  approveBillboard,
  rejectBillboard,
} from "@/lib/api";

import BillboardForm from "@/components/admin/BillboardForm";

interface BillboardsProps {
  onSelect?: (id: number) => void;
}

export default function Billboards({ onSelect }: BillboardsProps) {
  const [inventory, setInventory] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [editingItem, setEditingItem] = useState<Billboard | null>(null);

  /* ✅ FETCH */
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getBillboards();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch billboards error:", err);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ✅ DELETE */
  const handleDelete = async (id: number) => {
    try {
      await deleteBillboard(id);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ✅ APPROVE */
  const handleApprove = async (id: number) => {
    try {
      await approveBillboard(id.toString());
      alert("✅ Billboard Approved");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to approve billboard");
    }
  };

  /* ✅ REJECT */
  const handleReject = async (id: number) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await rejectBillboard(id.toString(), reason);
      alert("❌ Billboard Rejected");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to reject billboard");
    }
  };

  /* ✅ SUBMIT */
  const handleSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        const value = data[key];

        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (editingItem) {
        await updateBillboard(editingItem.id, formData);
      } else {
        await createBillboard(formData);
      }

      setIsFormOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /* ✅ FILTER */
  const filtered = inventory.filter((b) => {
    const location = b.location || "";
    const neighborhood = b.neighborhood || "";
    const status = b.status || "pending";

    // ✅ Filter by status
    if (statusFilter !== "all" && status !== statusFilter) {
      return false;
    }

    // ✅ Filter by search term
    return (
      location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ✅ Count by status
  const pendingCount = inventory.filter((b) => b.status === "pending").length;
  const approvedCount = inventory.filter((b) => b.status === "approved").length;
  const rejectedCount = inventory.filter((b) => b.status === "rejected").length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black dark:text-white">
            Live Inventory
          </h3>
          <p className="text-slate-500 text-sm mt-1">
            Manage all billboard listings
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
        >
          <Plus size={20} />
          <span>Add Billboard</span>
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-brand-card rounded-3xl border shadow-sm overflow-hidden">
        {/* FILTER */}
        <div className="p-6 flex flex-col gap-4 bg-slate-50 dark:bg-slate-900">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by location..."
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border text-sm"
              />
            </div>
          </div>

          {/* ✅ STATUS FILTER BUTTONS */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              All ({inventory.length})
            </button>

            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Pending ({pendingCount})
            </button>

            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Approved ({approvedCount})
            </button>

            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                statusFilter === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-slate-400">
                <th className="px-6 py-4">Billboard</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.imageUrl || "/placeholder.jpg"}
                        className="h-16 w-20 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold">{item.neighborhood}</p>
                        <p className="text-xs text-slate-500">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6">{item.category || "-"}</td>

                  {/* 🔥 STATUS */}
                  <td className="px-6 py-6">
                    {item.status === "approved" && (
                      <span className="text-green-600 font-bold">Approved</span>
                    )}
                    {item.status === "pending" && (
                      <span className="text-yellow-500 font-bold">Pending</span>
                    )}
                    {item.status === "rejected" && (
                      <div>
                        <span className="text-red-500 font-bold">Rejected</span>
                        {item.rejection_reason && (
                          <p className="text-xs text-red-400">
                            {item.rejection_reason}
                          </p>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {/* APPROVE */}
                      {item.status === "pending" && (
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition text-sm font-semibold"
                          title="Approve Billboard"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      )}

                      {/* REJECT */}
                      {item.status === "pending" && (
                        <button
                          onClick={() => handleReject(item.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                          title="Reject Billboard"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsFormOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-700 transition"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="p-12 text-center">No billboards found</div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isFormOpen && (
          <BillboardForm
            initialData={editingItem}
            onClose={() => {
              setIsFormOpen(false);
              setEditingItem(null);
            }}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
