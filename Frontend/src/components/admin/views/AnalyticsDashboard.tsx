import React from "react";

interface Billboard {
  status?: "approved" | "rejected" | "pending";
}

export function AnalyticsDashboard({ billboards = [] }: { billboards: Billboard[] }) {
  // ✅ REAL COUNTS
  const approved = billboards.filter(b => b.status === "approved").length;
  const rejected = billboards.filter(b => b.status === "rejected").length;
  const pending = billboards.filter(b => b.status === "pending").length;

  return (
    <div className="grid grid-cols-3 gap-6">

      <div className="p-6 bg-white rounded-2xl shadow">
        <h3 className="text-xs text-slate-400">Approved</h3>
        <p className="text-2xl font-bold">{approved}</p>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow">
        <h3 className="text-xs text-slate-400">Rejected</h3>
        <p className="text-2xl font-bold">{rejected}</p>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow">
        <h3 className="text-xs text-slate-400">Pending</h3>
        <p className="text-2xl font-bold">{pending}</p>
      </div>

    </div>
  );
}