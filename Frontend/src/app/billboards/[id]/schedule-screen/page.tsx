"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SchedulingPage from "@/components/ScheduleScreen";
import { Billboard } from "@/types";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const [billboard, setBillboard] = useState<Billboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillboard = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/billboards/${id}`
        );

        let data;

        try {
          data = await res.json();
        } catch {
          const text = await res.text();
          console.error("NOT JSON:", text);
          alert("Server returned invalid response");
          return;
        }

        setBillboard(data);
      } catch (err) {
        console.error("Failed to fetch billboard", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBillboard();
  }, [id]);

  if (loading || !billboard) {
    return <div className="text-white p-10">Loading...</div>;
  }

  // ✅ ADD THIS HANDLER
  const handleContinue = (data: any) => {
    console.log("Schedule data:", data);

    // 👉 You can later route to booking page here
    // router.push(`/booking/${billboard.id}`)
  };

  return (
    <SchedulingPage
      billboard={billboard}
      onBack={() => window.history.back()}
      onContinue={handleContinue} // ✅ FIXED
    />
  );
}