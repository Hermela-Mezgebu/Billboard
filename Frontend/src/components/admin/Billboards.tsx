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
  const [editingItem, setEditingItem] = useState<Billboard | null>(null);

  /* ✅ FETCH */
  const fetchData = async () => {
    try {
      setLoading(true);

      // ✅ FIXED: now allowed (after API fix)
      const data = await getBillboards({ status: "pending" });

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
    const neighborhood = (b as any).neighborhood || "";

    return (
      location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between">
        <h3 className="text-2xl font-black">Live Inventory</h3>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="border p-2 w-full"
      />

      <table className="w-full">
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td>
                <img
                  src={(item as any).image || "/placeholder.jpg"}
                  className="h-16"
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

      <AnimatePresence>
        {isFormOpen && (
          <BillboardForm
            initialData={editingItem}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}