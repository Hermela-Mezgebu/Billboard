"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SchedulingPage from "@/components/ScheduleScreen";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const [billboard, setBillboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillboard = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/billboards/${id}`
        );
        const data = await res.json();
        setBillboard(data);
      } catch (err) {
        console.error("Failed to fetch billboard", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBillboard();
  }, [id]);

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <SchedulingPage
      billboard={billboard}
      onBack={() => window.history.back()}
    />
  );
}