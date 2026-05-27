'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Play,
  ShoppingCart,
  MessageSquare,
  Send,
  X,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Billboard } from '../types';
import { cn } from '../lib/utils';
import { BookingPage } from './BookingPage';
import { BookingConfirmation } from './BookingConfirmation';
import ScheduleScreen from "./ScheduleScreen";

interface BillboardDetailProps {
  billboard: Billboard;
  onBack: () => void;
}

export default function BillboardDetail({ billboard, onBack }: BillboardDetailProps) {

  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [viewState, setViewState] = useState<'detail' | 'schedule' | 'booking' | 'confirmation'>('detail');
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isMessaging, setIsMessaging] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sent, setSent] = useState(false);

  // ✅ FETCH DATA
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/billboards")
      .then(res => res.json())
      .then(data => setBillboards(data))
      .catch(err => console.error(err));
  }, []);

  // ✅ IMAGES
  const images = useMemo(() => [
    billboard.image,
    ...(billboard.additionalImages || [])
  ].filter(Boolean), [billboard]);

  // ✅ DISTANCE FUNCTION
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // ✅ FIXED SIMILAR BILLBOARDS
const similarBillboards = useMemo(() => {
  if (!billboard || billboards.length === 0) return [];

  const normalize = (val: any) =>
    (val || "")
      .toString()
      .toLowerCase()
      .replace(/,/g, "")
      .trim();

  const currentLocation = normalize(billboard.location);
  const currentNeighborhood = normalize(billboard.neighborhood);

  return billboards
    .filter((b: Billboard) => {
      if (b.id === billboard.id) return false;

      const otherLocation = normalize(b.location);
      const otherNeighborhood = normalize(b.neighborhood);

      // ✅ SMART MATCHING (LIKE REAL SITES)
      return (
        otherLocation.includes(currentLocation) ||
        currentLocation.includes(otherLocation) ||
        otherNeighborhood === currentNeighborhood
      );
    })
    .slice(0, 3);
}, [billboard, billboards]);

  console.log("ALL:", billboards);
  console.log("CURRENT:", billboard);
  console.log("SIMILAR:", similarBillboards);

  // ---------------------------
  // HANDLERS
  // ---------------------------

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSent(true);

    setTimeout(() => {
      setSent(false);
      setMessageText('');
      setIsMessaging(false);
    }, 2000);
  };

  const handleScheduleConfirm = (data: any) => {
    setScheduleData(data);
    setViewState('booking');
  };

  const handleBookingConfirm = (details: any) => {
    setBookingDetails(details);
    setViewState('confirmation');
  };

  // ---------------------------
  // VIEW STATES
  // ---------------------------

  if (viewState === 'schedule') {
    return (
      <ScheduleScreen
        billboard={billboard}
        onBack={() => setViewState('detail')}
        onContinue={handleScheduleConfirm}
      />
    );
  }

  if (viewState === 'booking') {
    return (
      <BookingPage
        billboard={billboard}
        scheduleDetails={scheduleData}
        onBack={() => setViewState('schedule')}
        onConfirm={handleBookingConfirm}
      />
    );
  }

  if (viewState === 'confirmation') {
    return (
      <BookingConfirmation
        billboard={billboard}
        bookingDetails={bookingDetails}
        onClose={onBack}
      />
    );
  }

  // ---------------------------
  // UI
  // ---------------------------

 
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-brand-bg min-h-screen"
    >
      {/* TOP NAVIGATION BAR */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md dark:bg-brand-bg/80 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Billboards
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <MapPin size={14} />
              {billboard.neighborhood}
            </div>
            <button 
              onClick={() => setViewState('schedule')}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95"
            >
              <ShoppingCart size={18} />
              <span>Book & Pay</span>
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION: VIDEO + OWNER */}
      <section className="bg-slate-900 dark:bg-black overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* VIDEO CONTAINER */}
            <div className="lg:col-span-8 relative aspect-video rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] group border border-white/10 bg-slate-800 flex items-center justify-center">
              <img 
                src={images[0]} 
                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px] scale-110 transition-transform duration-[20s] group-hover:scale-100" 
                alt="Video Preview"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />
              
              {/* Play Button Overlay */}
              <div className="relative z-10 flex flex-col items-center gap-6">
                 <motion.button 
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   className="h-24 w-24 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] transition-shadow hover:shadow-[0_0_80px_rgba(79,70,229,0.8)]"
                 >
                   <Play size={40} fill="currentColor" className="ml-2" />
                 </motion.button>
                 <div className="text-center">
                    <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] opacity-60">Digital Experience Preview</p>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mt-2">{billboard.location}</h2>
                 </div>
              </div>

              {/* Stats Overlay */}
              <div className="absolute bottom-10 left-10 text-white space-y-1">
                 <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600/20 backdrop-blur-md rounded-full border border-indigo-500/30 w-fit">
                   <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Live Stream Data</span>
                 </div>
                 <p className="text-white/60 font-bold text-xs uppercase tracking-widest">
                   {billboard.reach} Verified Impressions / Month
                 </p>
              </div>
            </div>

            {/* OWNER CARD */}
            <div className="lg:col-span-4">
              <div className="h-full bg-white dark:bg-brand-card rounded-[3rem] p-10 flex flex-col items-center text-center shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-125" />
                 
                 <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 dark:border-slate-800 p-1.5 mb-8 relative shadow-inner">
                    <img src={billboard.owner?.logo} className="w-full h-full object-cover rounded-[2rem]" alt="Owner" />
                    <div className="absolute -bottom-1 -right-1 h-9 w-9 bg-green-500 rounded-full border-4 border-white dark:border-brand-card flex items-center justify-center shadow-lg">
                       <CheckCircle2 size={14} className="text-white" />
                    </div>
                 </div>

                 <div className="space-y-2 mb-8">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{billboard.owner?.name}</h3>
                    <div className="flex items-center justify-center gap-2">
                       <span className="h-0.5 w-4 bg-indigo-600 rounded-full" />
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Network Partner</span>
                       <span className="h-0.5 w-4 bg-indigo-600 rounded-full" />
                    </div>
                 </div>
                 
                 <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed italic">
                   "{billboard.owner?.description}"
                 </p>

                 <div className="w-full mt-auto space-y-4 pt-10">
                    <button 
                      onClick={() => setIsMessaging(true)}
                      className="group/btn w-full h-16 bg-slate-950 dark:bg-white dark:text-slate-950 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <MessageSquare size={22} className="group-hover/btn:rotate-12 transition-transform" />
                      Contact Owner
                    </button>
                    <div className="flex items-center justify-center gap-6">
                       <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Portfolio</button>
                       <div className="h-1 w-1 rounded-full bg-slate-300" />
                       <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Reviews</button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MIDDLE SECTION: ABOUT VS LOCATION */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            {/* ABOUT */}
            <div className="space-y-16">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-[2px] w-12 bg-indigo-600" />
                    <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em]">Inventory Analysis</span>
                  </div>
                  <h2 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.9]">
                    Prime Visibility <br />
                    <span className="text-indigo-600">Site {String(billboard.id).padStart(3, '0')}</span>
                  </h2>
               </div>

               <div className="space-y-8">
                  <p className="text-2xl text-slate-600 dark:text-slate-400 font-medium leading-[1.4] first-letter:text-8xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-slate-950 dark:first-letter:text-white first-letter:leading-[0.8] first-letter:mt-2">
                    {billboard.description}
                  </p>
                  <p className="text-lg text-slate-400 font-medium leading-relaxed italic border-l-4 border-slate-100 dark:border-slate-800 pl-8 ml-2">
                    Strategically engineered to capture high-velocity traffic flows and ensure maximum dwell time for brand engagement.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-y-12 gap-x-8 pt-8 px-2">
                  <SpecItem label="Physical Scale" value={billboard.size || "N/A"} />
<SpecItem label="Placement Type" value={billboard.category || "Standard"} />
<SpecItem label="Monthly Investment" value={`$${billboard.pricePerMonth || 0}`} highlight />
                  <SpecItem label="Auditor Rating" value="A+ Premium" />
               </div>
            </div>

            {/* LOCATION MAP */}
            <div className="lg:sticky lg:top-40">
               <div className="bg-slate-950 rounded-[4rem] p-1.5 shadow-[0_50px_100px_rgba(0,0,0,0.15)] overflow-hidden">
                  <div className="bg-white dark:bg-brand-card rounded-[3.8rem] p-12 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-10">
                       <div>
                          <h4 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-none">Geo-Point</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{billboard.neighborhood} Hub</p>
                       </div>
                       <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-950 rounded-2xl flex items-center justify-center text-indigo-600">
                          <MapPin size={28} />
                       </div>
                    </div>

                    <div className="relative h-[450px] rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 group bg-slate-100">
                      <img 
                         src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600" 
                         className="w-full h-full object-cover grayscale opacity-20 group-hover:opacity-40 transition-opacity duration-1000" 
                         alt="Map Placeholder"
                      />
                      <div className="absolute inset-0 bg-indigo-900/5" />
                      
                      {/* Interactive Radar */}
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="relative">
                            <div className="absolute -inset-16 bg-indigo-500/10 rounded-full animate-[ping_3s_linear_infinite]" />
                            <div className="absolute -inset-8 bg-indigo-500/20 rounded-full animate-[ping_2s_linear_infinite]" />
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="relative h-12 w-12 bg-indigo-600 rounded-[1.2rem] border-4 border-white shadow-2xl flex items-center justify-center text-white"
                            >
                               <MapPin size={20} />
                            </motion.div>
                         </div>
                      </div>

               <div className="absolute bottom-8 right-8">
                         <button 
                           onClick={() => setViewState('schedule')}
                           className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95"
                         >
                           Confirm & Book Now
                           <ArrowLeft size={16} className="rotate-180" />
                         </button>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIMILAR BILLBOARDS */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-0.5 w-12 bg-indigo-600" />
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em]">Radius Scan</span>
                </div>
                <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Localized Inventory</h2>
             </div>
             <button className="h-16 px-10 bg-white dark:bg-brand-card border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 hover:text-indigo-600 transition-all uppercase tracking-[0.3em] shadow-sm">
               View All {billboard.location} Sites
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {similarBillboards.map((b) => (
  <motion.div
    key={b.id}
    whileHover={{ y: -15 }}
    className="bg-white dark:bg-brand-card rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl group cursor-pointer flex flex-col"
  >
    <div className="h-56 relative overflow-hidden">
      <img
        src={b.image}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        alt={b.location}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
        {b.category} Hub
      </div>
    </div>

    <div className="p-10 flex-grow flex flex-col">
      <div className="flex-grow">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">
          {b.location}
        </h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {b.neighborhood}
        </p>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Standard Rate
          </p>
          <span className="text-xl font-black text-indigo-600">
            ${b.pricePerMonth}
            <span className="text-xs text-slate-400">/M</span>
          </span>
        </div>

        <button className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
          <ArrowLeft className="rotate-180" size={20} />
        </button>
      </div>
    </div>
  </motion.div>
))}
          </div>
        </div>
      </section>

      {/* MESSAGING OVERLAY */}
      <AnimatePresence>
        {isMessaging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 30 }}
               className="w-full max-w-2xl bg-white dark:bg-brand-card rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10"
             >
                {/* Header */}
                <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                   <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-[1.5rem] overflow-hidden bg-white shadow-xl p-1.5 border border-slate-100">
                         <img src={billboard.owner?.logo} className="w-full h-full object-cover rounded-[1rem]" />
                      </div>
                      <div>
                         <h4 className="text-xl font-black dark:text-white uppercase tracking-tight">Direct Channel: {billboard.owner?.name}</h4>
                         <div className="flex items-center gap-2 mt-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Regarding {billboard.location} Site</p>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => setIsMessaging(false)} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-xl text-slate-400 hover:text-slate-950 dark:hover:text-white transition-all hover:scale-110 active:scale-95">
                      <X size={24} strokeWidth={3} />
                   </button>
                </div>

                <div className="p-12">
                   {sent ? (
                     <div className="py-24 text-center space-y-8">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-28 w-28 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-[0_20px_50px_rgba(34,197,94,0.3)]"
                        >
                           <CheckCircle2 size={56} strokeWidth={3} />
                        </motion.div>
                        <div className="space-y-3">
                           <h3 className="text-4xl font-black dark:text-white uppercase tracking-tighter">Inquiry Transmitted</h3>
                           <p className="text-slate-500 font-medium text-lg">Expected response within <span className="text-indigo-600 font-black">2.4 Hours</span></p>
                        </div>
                     </div>
                   ) : (
                     <form onSubmit={handleSendMessage} className="space-y-8">
                        <div className="relative group">
                           <textarea 
                             autoFocus
                             value={messageText}
                             onChange={(e) => setMessageText(e.target.value)}
                             placeholder="Inquire about availability, technical display specs, or multi-site network discounts..."
                             className="w-full h-64 bg-slate-50 dark:bg-slate-950 rounded-[3rem] p-10 text-lg font-medium border-4 border-transparent focus:border-indigo-600 outline-none transition-all resize-none shadow-inner dark:text-white"
                           />
                           <div className="absolute top-10 right-10">
                              <MessageSquare size={24} className="text-slate-200 group-focus-within:text-indigo-200 transition-colors" />
                           </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2rem] flex items-start gap-5 border border-indigo-100 dark:border-indigo-900/30">
                           <div className="h-10 w-10 bg-white dark:bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                              <Info className="text-indigo-600 dark:text-white" size={20} />
                           </div>
                           <p className="text-[10px] font-black text-slate-500 dark:text-indigo-200 uppercase leading-[1.8] tracking-[0.1em]">
                             Network security protocol engaged. Our auditors monitor all initial inquiries to ensure professional compliance. Secure contracts will be generated via your client dashboard.
                           </p>
                        </div>

                        <button 
                          type="submit"
                          className="group/send w-full h-20 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0"
                        >
                           <Send size={24} className="group-hover/send:translate-x-1 group-hover/send:-translate-y-1 transition-transform" />
                           Dispatch Secure Inquiry
                        </button>
                     </form>
                   )}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SpecItem({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
         <div className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
         <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
           {label}
         </span>
      </div>
      <p className={cn(
        "text-3xl font-black uppercase leading-[0.8] tracking-tighter",
        highlight ? "text-indigo-600" : "text-slate-900 dark:text-white"
      )}>
        {value}
      </p>
    </div>
  );
}

