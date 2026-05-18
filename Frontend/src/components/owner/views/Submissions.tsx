"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  ImageIcon
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Billboard {
  id: number;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  created_at: string;
}

export default function Submissions() {
  const [pending, setPending] = useState<Billboard[]>([]);

  // ✅ FETCH PENDING BILLBOARDS
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin/billboards/pending", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    })
      .then(res => res.json())
      .then(data => setPending(data))
      .catch(err => console.error(err));
  }, []);

  // ✅ APPROVE
  const approve = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/api/admin/billboards/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    // remove from UI
    setPending(prev => prev.filter(b => b.id !== id));
  };

  // ✅ REJECT
  const reject = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/api/admin/billboards/${id}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Rejected by admin"
      })
    });

    setPending(prev => prev.filter(b => b.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter leading-none">
            Authentication Lab
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            New placements awaiting network verification
          </p>
        </div>

        <div className="flex px-6 py-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl items-center gap-3">
          <History size={18} className="text-indigo-600" />
          <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">
            Global Audit Rate: 98.4%
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {pending.map(sub => (
            <div key={sub.id} className="bg-white dark:bg-brand-card p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">

              <div className="flex flex-col lg:flex-row lg:items-center justify-between relative z-10">

                <div className="flex items-center gap-8 mb-6 lg:mb-0">
                  <div className="h-24 w-24 bg-slate-50 dark:bg-slate-950 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner shrink-0">
                    <ImageIcon size={40} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        ID-{sub.id}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(sub.created_at).toDateString()}
                      </span>
                    </div>

                    <h4 className="text-2xl font-black dark:text-white tracking-widest uppercase">
                      {sub.location}
                    </h4>

                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-tight">
                        Bid:
                        <span className="text-slate-900 dark:text-white font-black">
                          ${sub.price}/M
                        </span>
                      </p>

                      <div className="h-1 w-1 bg-slate-300" />

                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                        {sub.type} HUB
                      </span>
                    </div>
                  </div>
                </div>

                {/* STATUS + ACTIONS */}
                <div className="flex items-center gap-6">

                  <div className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                    "bg-amber-100 dark:bg-amber-900/20 text-amber-600"
                  )}>
                    <Clock size={14} />
                    Pending
                  </div>

                  {/* ✅ ACTION BUTTONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(sub.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => reject(sub.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
                    >
                      Reject
                    </button>
                  </div>

                  <button className="h-14 w-14 flex items-center justify-center border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
                    <MoreVertical size={24} />
                  </button>

                </div>
              </div>

              {/* PROGRESS (UNCHANGED UI) */}
              <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center justify-between relative px-2">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />

                  {[1, 2, 3].map((s) => (
                    <div key={s} className="relative z-10 flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 bg-indigo-600 border-indigo-600 text-white">
                        {s === 1 ? <CheckCircle2 size={14} /> : s}
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-widest mt-2 text-indigo-600">
                        {s === 1 ? 'Technical' : s === 2 ? 'Audit' : 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}

          {/* EMPTY STATE */}
          {pending.length === 0 && (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black dark:text-white uppercase tracking-tighter">
                No Pending Billboards
              </h3>
            </div>
          )}

        </div>

        {/* RIGHT SIDE (UNCHANGED) */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <AlertCircle className="absolute -right-6 -top-6 text-white/5" size={140} />
            <h3 className="text-lg font-black uppercase tracking-tight relative z-10">
              Verification Guide
            </h3>
            <p className="text-slate-400 text-xs font-medium mt-4 relative z-10">
              Standard review takes 24-48 hours.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}