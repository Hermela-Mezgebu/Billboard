"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [billboards, setBillboards] = useState<any[]>([]);

  const fetchPending = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/admin/billboards/pending",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setBillboards(res.data);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (id: number) => {
    await axios.post(
      `http://127.0.0.1:8000/api/admin/billboards/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchPending();
  };

  const reject = async (id: number) => {
    const reason = prompt("Enter rejection reason");

    await axios.post(
      `http://127.0.0.1:8000/api/admin/billboards/${id}/reject`,
      { message: reason },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    fetchPending();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Pending Billboards</h1>

      <div className="grid gap-6">
        {billboards.map((b) => (
          <div key={b.id} className="border p-4 rounded-lg">
            <img
              src={`http://127.0.0.1:8000/storage/${b.image}`}
              className="w-full h-48 object-cover"
            />

            <h2 className="text-xl font-bold">{b.title}</h2>
            <p>{b.location}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => approve(b.id)}
                className="bg-green-500 text-white px-4 py-2"
              >
                Approve
              </button>

              <button
                onClick={() => reject(b.id)}
                className="bg-red-500 text-white px-4 py-2"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}