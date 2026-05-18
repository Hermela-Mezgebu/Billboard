"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBookings() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/admin/bookings")
      .then(res => setData(res.data));
  }, []);

  const approve = async (id: number) => {
    await axios.post(`http://127.0.0.1:8000/api/admin/bookings/${id}/approve`);
    alert("Approved");
  };

  return (
    <div className="p-10 text-white">
      {data.map((b: any) => (
        <div key={b.id} className="border p-4 mb-4">
          <p>{b.start_date} → {b.end_date}</p>
          <button onClick={() => approve(b.id)} className="bg-green-600 px-4 py-2">
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}