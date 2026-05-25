"use client";

import React, { useEffect, useState } from "react";
import { detectFraud } from "@/lib/ai";
import { notify } from "@/lib/notifications";
import { canApprove } from "@/lib/permissions";
import { SubmissionModal } from "./SubmissionModal";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { getSubmissions, updateSubmissionStatus } from "@/lib/api";

export function SubmissionsView() {
  const [subs, setSubs] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [role] = useState<"admin">("admin");

  // analytics (you can keep this if you want for other use)
  const [stats, setStats] = useState({
    approved: 0,
    rejected: 0,
    fraud: 0
  });

  useEffect(() => {
    load();
  }, []);

const load = async () => {
  const res = await getSubmissions();

  // ✅ FIX: normalize response
  const data = Array.isArray(res) ? res : res?.data || [];

  const enriched = await Promise.all(
    data.map(async (s: any) => {
      const ai = await detectFraud(s);

      return {
        ...s,
        ai
      };
    })
  );

  setSubs(enriched);

  setStats({
    approved: enriched.filter(s => s.status === "approved").length,
    rejected: enriched.filter(s => s.status === "rejected").length,
    fraud: enriched.filter(s => s.ai?.isFake).length
  });
};

  const handleAction = async (id: string, status: string) => {
    if (!canApprove(role)) {
      notify("No permission", "error");
      return;
    }

    await updateSubmissionStatus(id, status);

    notify(`Submission ${status}`);
    load();
  };

  return (
    <div className="space-y-10">

      {/* ✅ FIX: pass billboards instead of data */}
      <AnalyticsDashboard billboards={subs} />

      {/* LIST */}
      <div className="grid gap-6">
        {subs.map(sub => (
          <div
            key={sub.id}
            className="p-6 bg-white rounded-2xl flex justify-between items-center"
          >
            <div className="flex gap-4 items-center">
              <img
                src={sub.images?.[0]}
                className="w-28 h-20 rounded-lg object-cover cursor-pointer"
                onClick={() => setSelected(sub)}
              />

              <div>
                <h3 className="font-bold">{sub.location}</h3>
                <p className="text-xs text-slate-500">{sub.owner}</p>

                {sub.ai?.isFake && (
                  <p className="text-red-500 text-xs">
                    ⚠ Fake ({Math.round(sub.ai.confidence * 100)}%)
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAction(sub.id, "approved")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => handleAction(sub.id, "rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selected && (
        <SubmissionModal
          sub={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}