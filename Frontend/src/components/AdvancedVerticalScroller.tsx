"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const images = [
  "/img/billboard-1.jpg",
  "/img/billboard-6.jpg",
  "/img/billboard-1.jpg",
  "/img/billboard-6.jpg",
  "/img/billboard-6.jpg",
];

export default function AdvancedVerticalScroller({
  side = "left",
}: {
  side?: "left" | "right";
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`absolute top-0 h-full w-[140px] hidden lg:block ${
        side === "left" ? "left-0" : "right-0"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{
          y: hovered
            ? 0
            : side === "left"
            ? ["0%", "-100%"]
            : ["-100%", "0%"],
        }}
        transition={{
          duration: hovered ? 0 : 30,
          ease: "linear",
          repeat: hovered ? 0 : Infinity,
        }}
        className="flex flex-col gap-8"
      >
        {[...images, ...images].map((src, i) => {
          const rotate = side === "left" ? -8 : 8;

          return (
            <motion.div
              key={i}
              style={{ transform: `rotateY(${rotate}deg)` }}
              className="relative w-full h-44"
            >
              <motion.div whileHover={{ scale: 1.1 }}>
                <Image
                  src={src}
                  alt="billboard"
                  fill
                  className="object-cover rounded-xl"
                />
              </motion.div>

              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-xl" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}