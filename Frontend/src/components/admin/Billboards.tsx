"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
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

      // ✅ FIX: no arguments
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
      // ✅ FIX: pass number, NOT string
      await approveBillboard(id);

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
      // ✅ FIX: pass number
      await rejectBillboard(id, reason);

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
    const neighborhood = (b as any).neighborhood || ""; // ✅ safe fix
    const status = b.status || "pending";

    if (statusFilter !== "all" && status !== statusFilter) {
      return false;
    }

    return (
      location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

          {/* STATUS FILTER */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setStatusFilter("all")}>
              All ({inventory.length})
            </button>
            <button onClick={() => setStatusFilter("pending")}>
              Pending ({pendingCount})
            </button>
            <button onClick={() => setStatusFilter("approved")}>
              Approved ({approvedCount})
            </button>
            <button onClick={() => setStatusFilter("rejected")}>
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-6">
                    <img
                      src={(item as any).imageUrl || "/placeholder.jpg"} // ✅ safe fix
                      className="h-16 w-20 rounded-xl object-cover"
                    />
                  </td>

                  <td>{item.location}</td>

                  <td>{item.status}</td>

                  <td>
                    {item.status === "pending" && (
                      <>
                        <button onClick={() => handleApprove(item.id)}>
                          Approve
                        </button>
                        <button onClick={() => handleReject(item.id)}>
                          Reject
                        </button>
                      </>
                    )}
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