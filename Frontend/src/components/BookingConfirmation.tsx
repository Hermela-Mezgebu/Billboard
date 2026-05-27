import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  QrCode, 
  Download, 
  MapPin, 
  Calendar, 
  CreditCard,
  ExternalLink,
  Printer
} from 'lucide-react';
import { Billboard } from '../types';
import { cn } from '../lib/utils';

interface BookingConfirmationProps {
  billboard: Billboard;
  bookingDetails: any;
  onClose: () => void;
}

export function BookingConfirmation({ billboard, bookingDetails, onClose }: BookingConfirmationProps) {
  const bookingId = "ORD-" + Math.floor(Math.random() * 90000 + 10000);
  const totalPrice = billboard.pricePerMonth * 3;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 dark:bg-brand-bg min-h-screen pb-20"
    >
      {/* STEPS HEADER */}
      <div className="bg-white dark:bg-brand-card border-b border-slate-200 dark:border-slate-800 py-6">
         <div className="mx-auto max-w-7xl px-4 flex justify-center items-center gap-4 sm:gap-12">
            <Step number={1} label="Selection" completed />
            <div className="h-[2px] w-8 sm:w-16 bg-green-500 rounded-full" />
            <Step number={2} label="Verification" completed />
            <div className="h-[2px] w-8 sm:w-16 bg-green-500 rounded-full" />
            <Step number={3} label="Payment" completed />
            <div className="h-[2px] w-8 sm:w-16 bg-green-500 rounded-full" />
            <Step number={4} label="Live Status" active />
         </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            {/* SUCCESS BANNER */}
            <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-[3rem] p-10 flex flex-col sm:flex-row items-center gap-8">
               <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/20 shrink-0">
                  <CheckCircle2 size={40} />
               </div>
               <div>
                  <h2 className="text-3xl font-black text-green-600 uppercase tracking-tighter">Your booking is confirmed</h2>
                  <p className="text-green-700/60 font-medium text-sm mt-1 leading-relaxed">
                    Transaction protocol successful. Site {billboard.id} has been reserved under your network identity. High-resolution campaign assets can now be uploaded via your portal.
                  </p>
               </div>
            </div>

            {/* DETAILS GRID */}
            <div className="bg-white dark:bg-brand-card rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-xl space-y-12">
               <div className="flex justify-between items-start">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Inventory Details</h3>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network ID</p>
                     <p className="text-sm font-black text-indigo-600 uppercase">#{bookingId}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-8">
                  <DetailItem label="Primary Guest" value={`${bookingDetails.firstName} ${bookingDetails.lastName}`} />
                  <DetailItem label="Check-In (Live)" value="Jun 01, 2026" />
                  <DetailItem label="Check-Out" value="Aug 31, 2026" />
                  <DetailItem label="Network Site" value={billboard.location} />
                  <DetailItem label="Contact Link" value={bookingDetails.email} />
                  <DetailItem label="Billing Phone" value={bookingDetails.phone} />
               </div>

               {/* QR SECTION */}
               <div className="pt-12 border-t border-slate-50 dark:border-slate-800">
                  <div className="bg-slate-50 dark:bg-slate-950/50 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 border-2 border-dashed border-slate-200 dark:border-slate-800">
                     <div className="h-40 w-40 bg-white p-4 rounded-3xl shadow-xl flex items-center justify-center border border-slate-100">
                        <QrCode size={120} className="text-slate-950" />
                     </div>
                     <div className="flex-grow">
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Digital Access Token</h4>
                        <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
                           Scan this token for on-site technical diagnostics or to grant third-party installers access to the site's digital control unit. Valid for duration of the contract.
                        </p>
                        <div className="flex items-center gap-4 mt-8">
                           <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                              <Download size={14} /> Download PDF
                           </button>
                           <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm">
                              <Printer size={14} /> Print Audit
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full h-20 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-lg shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-4"
            >
              Go to Dashboard <ArrowRight size={24} />
            </button>
          </div>

          {/* SIDEBAR SUMMARY */}
          <div className="lg:col-span-4">
             <div className="bg-white dark:bg-brand-card rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8">Reservation Summary</h3>
                
                <div className="space-y-6 pb-10 border-b border-slate-50 dark:border-slate-800">
                   <div className="flex gap-4">
                      <div className="h-20 w-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                         <img src={billboard.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                         <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-1">Contracted Entity</p>
                         <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{billboard.location}</h4>
                      </div>
                   </div>
                </div>

                <div className="py-8 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Monthly Ops</span>
                    <span className="font-black dark:text-white">${billboard.pricePerMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Processing</span>
                    <span className="font-black dark:text-white">$150.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Security Escrow</span>
                    <span className="font-black dark:text-white">$2,000.00</span>
                  </div>
                  <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-end">
                    <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg leading-none">Total Settlement</span>
                    <span className="text-3xl font-black text-green-500 tracking-tighter">${(totalPrice + 150 + 2000).toLocaleString()}</span>
                  </div>
                </div>

                <button className="w-full h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl text-[10px] font-black uppercase text-indigo-600 flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border border-slate-100 dark:border-slate-800 mt-6">
                   <Download size={14} /> Download Ledger Invoice
                </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Step({ number, label, completed = false, active = false }: { number: number, label: string, completed?: boolean, active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
       <div className={cn(
         "h-10 w-10 rounded-full flex items-center justify-center text-xs font-black transition-all",
         completed ? "bg-green-500 text-white shadow-lg shadow-green-500/20" :
         active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" :
         "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-800"
       )}>
         {completed ? <CheckCircle2 size={18} strokeWidth={3} /> : number}
       </div>
       <span className={cn(
         "text-[10px] font-black uppercase tracking-widest hidden sm:inline",
         completed ? "text-green-600" : active ? "text-indigo-600" : "text-slate-400"
       )}>{label}</span>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
       <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{value}</p>
    </div>
  );
}
