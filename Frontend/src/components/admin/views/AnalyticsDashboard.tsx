import React from "react";

export function AnalyticsDashboard({ data }: any) {
  return (
    <div className="grid grid-cols-3 gap-6">

      <div className="p-6 bg-white rounded-2xl shadow">
        <h3 className="text-xs text-slate-400">Approved</h3>
        <p className="text-2xl font-bold">{data.approved}</p>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow">
        <h3 className="text-xs text-slate-400">Rejected</h3>
        <p className="text-2xl font-bold">{data.rejected}</p>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow">
        <h3 className="text-xs text-slate-400">Fraud Detected</h3>
        <p className="text-2xl font-bold">{data.fraud}</p>
      </div>

    </div>
  );
}