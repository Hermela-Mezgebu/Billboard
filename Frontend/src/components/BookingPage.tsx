import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CreditCard,
  Lock,
  ChevronDown,
  Info,
  ArrowLeft
} from 'lucide-react';
import { Billboard } from '../types';
import { cn } from '../lib/utils';

interface BookingPageProps {
  billboard: Billboard;
  scheduleDetails: any;
  onBack: () => void;
  onConfirm: (details: any) => void;
}

export function BookingPage({ billboard, scheduleDetails, onBack, onConfirm }: BookingPageProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'credit-card'
  });

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const paymentUrl = localStorage.getItem("payment_url");

  if (!paymentUrl) {
    alert("Payment URL not found");
    return;
  }

  // optionally store form + booking info
  localStorage.setItem(
    "final_booking",
    JSON.stringify({ ...formData, ...scheduleDetails })
  );

  // redirect to payment gateway
  window.location.href = paymentUrl;
};

  const adPrice = scheduleDetails?.price || (billboard.pricePerMonth / 100); // fallback
  const processingFee = 150;
  const tax = adPrice * 0.08;
  const total = adPrice + processingFee + tax;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-50 dark:bg-brand-bg min-h-screen pb-20"
    >
      {/* Header */}
      <div className="bg-white dark:bg-brand-card border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 py-8">
           <button 
             onClick={onBack}
             className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors mb-6"
           >
             <ArrowLeft size={16} />
             Edit Selection
           </button>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Complete Your Booking</h1>
           <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Secure network reservation portal</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-8 space-y-8">
            {/* Guest Details */}
            <Section title="Owner & Contact Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" placeholder="Barry" value={formData.firstName} onChange={(v) => setFormData({...formData, firstName: v})} />
                <Input label="Last Name" placeholder="Allen" value={formData.lastName} onChange={(v) => setFormData({...formData, lastName: v})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Input label="Email Address" placeholder="barry@star-labs.com" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                <Input label="Phone Number" placeholder="+251 900 000 000" value={formData.phone} onChange={(v) => setFormData({...formData, phone: v})} />
              </div>
            </Section>

            {/* Campaign Details */}
            <Section title="Campaign Intelligence">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select label="Display Preference" options={['Digital Loop (15s)', 'Exclussive 100%', 'Smart Day-Trigger']} />
                <Select label="Reporting Level" options={['Standard (Weekly)', 'Pro (Real-time)', 'Audited (Monthly)']} />
              </div>
            </Section>

            {/* Payment */}
            <Section title="Secure Ledger Verification">
              <div className="bg-slate-50 dark:bg-slate-950/50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <CreditCard className="text-indigo-600" />
                      <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Encrypted Payment</span>
                   </div>
                   <Lock className="text-slate-300" size={18} />
                </div>
                
                <div className="space-y-6">
                  <Input label="Card Number" placeholder="0000 0000 0000 0000" />
                  <div className="grid grid-cols-2 gap-6">
                    <Input label="Expiry Date" placeholder="MM/YY" />
                    <Input label="CVV" placeholder="***" />
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                   <input type="checkbox" id="terms" className="h-5 w-5 rounded border-slate-300 text-indigo-600" />
                   <label htmlFor="terms" className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                      I agree to the Network Terms of Service and Anti-Fraud Protocols.
                   </label>
                </div>
              </div>
            </Section>

            <button 
              onClick={handleSubmit}
              className="w-full h-20 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-lg shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all"
            >
              Authorize Booking & Pay
            </button>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-40 bg-white dark:bg-brand-card rounded-[3rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
               <div className="h-48 w-full rounded-[2rem] overflow-hidden mb-8 relative">
                  <img src={billboard.image} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute top-4 left-4 px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                    Selected Site
                  </div>
               </div>

               <div className="space-y-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{billboard.location}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{billboard.neighborhood} Hub</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Slot Date</p>
                        <div className="flex items-center gap-2 text-xs font-black dark:text-white uppercase"><Calendar size={12} className="text-indigo-600" /> Oct {scheduleDetails?.date}, 2026</div>
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Slot</p>
                        <div className="flex items-center gap-2 text-xs font-black dark:text-white uppercase"><Clock size={12} className="text-indigo-600" /> {scheduleDetails?.slot?.split(' - ')[0]}</div>
                     </div>
                  </div>
               </div>

               <div className="pt-8 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Slot Rate ({scheduleDetails?.duration}s)</span>
                    <span className="font-black dark:text-white">${adPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Processing</span>
                    <span className="font-black dark:text-white">${processingFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Tax / VAT (8%)</span>
                    <span className="font-black dark:text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 flex justify-between items-end">
                    <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-lg leading-none">Total Due</span>
                    <span className="text-3xl font-black text-indigo-600 tracking-tighter">${total.toLocaleString()}</span>
                  </div>
               </div>
               
               <div className="mt-10 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-start gap-3">
                  <Info className="text-indigo-600 shrink-0" size={16} />
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-relaxed">
                    By confirming, you authorize a hold on your digital wallet for the first month's site rental.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-brand-card p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8 pb-4 border-b border-slate-50 dark:border-slate-800">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Input({ label, placeholder, value, onChange }: { label: string, placeholder: string, value?: string, onChange?: (val: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full h-16 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-6 font-black text-slate-900 dark:text-white uppercase transition-all outline-none"
      />
    </div>
  );
}

function Select({ label, options }: { label: string, options: string[] }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select className="w-full h-16 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 rounded-2xl px-12 font-black text-slate-900 dark:text-white uppercase transition-all outline-none appearance-none">
          {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
      </div>
    </div>
  );
}
