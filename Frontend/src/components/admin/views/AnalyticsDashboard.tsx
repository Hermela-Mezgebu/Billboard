import React from "react";

export function AnalyticsDashboard({ data }: any) {
  // ✅ FIX: SAFE DEFAULT VALUES
  const safeData = {
    approved: data?.approved ?? 0,
    rejected: data?.rejected ?? 0,
    fraud: data?.fraud ?? 0,
  };

  return (
    <div className="grid grid-cols-3 gap-6">

      <div className="p-6 bg-white rounded-2xl shadow">
        <h3 className="text-xs text-slate-400">Approved</h3>
        <p className="text-2xl font-bold">{safeData.approved}</p>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow">
        <h3 className="text-xs text-slate-400">Rejected</h3>
        <p className="text-2xl font-bold">{safeData.rejected}</p>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow">
        <h3 className="text-xs text-slate-400">Fraud Detected</h3>
        <p className="text-2xl font-bold">{safeData.fraud}</p>
      </div>

    </div>
  );
}