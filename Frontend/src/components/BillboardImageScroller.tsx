"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { billboardData, Billboard } from "@/types";

interface Props {
  onSelect?: (billboard: Billboard) => void;
}

export default function BillboardImageScroller({ onSelect }: Props) {
  const loopImages = [...billboardData, ...billboardData];

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <div className="relative overflow-hidden py-14">
      <motion.div
        className="flex gap-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {loopImages.map((billboard, index) => (
          <div
            key={index}
            className="group relative min-w-[340px] h-[220px] flex-shrink-0 rounded-3xl overflow-hidden cursor-pointer"
            onClick={() => onSelect?.(billboard)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              setTilt({ x: y * 12, y: x * 12 });
            }}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >
            {/* IMAGE */}
            <motion.img
              src={billboard.imageUrl}
              alt={billboard.neighborhood}
              className="w-full h-full object-cover"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.05)`,
              }}
              transition={{ type: "spring", stiffness: 120 }}
            />

            {/* 🔥 DARK OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition" />

            {/* 🔥 TEXT OVERLAY */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-lg font-bold">
                {billboard.neighborhood}
              </h3>
              <p className="text-sm opacity-80">
                {billboard.category} • ${billboard.pricePerMonth}/mo
              </p>
            </div>

            {/* 🔥 HOVER EFFECT */}
            <div className="absolute inset-0 ring-0 group-hover:ring-2 ring-indigo-500 transition rounded-3xl" />
          </div>
        ))}
      </motion.div>

      {/* 🔥 EDGE FADE */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-brand-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-brand-bg to-transparent" />
    </div>
  );
}