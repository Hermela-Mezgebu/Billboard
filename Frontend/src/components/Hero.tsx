"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    image:
      "https://graphicsfamily.com/wp-content/uploads/edd/2022/12/Big-Billboard-Banner-Design-Template-1536x864.jpg",
  },
  {
    id: 2,
    image:
      "https://cdngbp.circleone.in/media/catalog/product/n/0/n0_bbvbbp01_2_IND.jpg",
  },
  {
    id: 3,
    image:
      "https://pixpine.com/wp-content/uploads/2024/05/Free-Concrete-Wall-Billboard-Mockup-1.jpg",
  },
  {
    id: 4,
    image:
      "https://unblast.com/wp-content/uploads/2022/11/Clumsy-Wall-Billboard-Mockup-1536x1152.jpg",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden">

      {/* 🔥 SLIDES */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt="billboard"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* 🔥 LEFT BUTTON */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition"
      >
        <ChevronLeft size={28} />
      </button>

      {/* 🔥 RIGHT BUTTON */}
      <button
        onClick={next}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition"
      >
        <ChevronRight size={28} />
      </button>

      {/* 🔥 INDICATORS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              current === i ? "w-8 bg-white" : "w-2 bg-white/40"
            )}
          />
        ))}
      </div>
    </section>
  );
}