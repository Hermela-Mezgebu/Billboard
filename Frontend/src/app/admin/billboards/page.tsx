"use client";

import { useEffect, useState } from "react";

interface Billboard {
  id: number;
  title: string;
  location: string;
  image: string;
  status: string;
}

export default function AdminBillboards() {
  const [list, setList] = useState<Billboard[]>([]);

  // ✅ LOAD PENDING
  const load = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/admin/billboards");
    const data = await res.json();
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ APPROVE
  const approve = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/api/admin/billboards/${id}/approve`, {
      method: "PUT",
    });
    load();
  };

  // ❌ REJECT
  const reject = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/api/admin/billboards/${id}/reject`, {
      method: "PUT",
    });
    load();
  };

  return (
    <div className="p-10 text-white bg-[#0b0e14] min-h-screen">
      <h1 className="text-3xl mb-6 font-bold">Admin Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {list.map((b) => (
          <div key={b.id} className="bg-gray-800 rounded-xl p-4">
            <img src={b.image} className="h-40 w-full object-cover rounded" />

            <h2 className="mt-3 font-bold">{b.title}</h2>
            <p className="text-sm text-gray-400">{b.location}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => approve(b.id)}
                className="bg-green-600 px-4 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => reject(b.id)}
                className="bg-red-600 px-4 py-2 rounded"
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