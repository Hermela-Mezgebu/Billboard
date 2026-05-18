"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface BlogCardProps {
  id: number | string;
  featuredImg: string;
  date: string;
  ownerImg: string;
  ownerName: string;
  title: string;
  category?: string;
}

export default function BlogCard({
  id,
  featuredImg,
  date,
  ownerImg,
  ownerName,
  title,
  category = "Billboard Insights",
}: BlogCardProps) {
  return (
    <motion.article
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-6 pb-6 pt-72 sm:pt-48 lg:pt-72 shadow-lg border border-white/10 group"
    >
      {/* 🔥 BACKGROUND IMAGE */}
      <Image
        src={featuredImg}
        alt={title}
        fill
        className="absolute inset-0 -z-10 object-cover group-hover:scale-110 transition duration-700"
      />

      {/* 🔥 GRADIENT OVERLAY */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* 🔥 CATEGORY BADGE */}
      <span className="absolute top-4 left-4 bg-indigo-600 text-xs px-3 py-1 rounded-full font-semibold tracking-wide">
        {category}
      </span>

      {/* 🔥 META INFO */}
      <div className="flex flex-wrap items-center gap-y-1 text-sm text-gray-300">
        <time className="mr-6">{date}</time>

        <div className="flex items-center gap-x-3">
          <span className="w-1 h-1 bg-white/50 rounded-full"></span>

          <div className="flex items-center gap-x-2">
            <Image
              src={ownerImg}
              alt={ownerName}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
            <span className="text-xs">{ownerName}</span>
          </div>
        </div>
      </div>

      {/* 🔥 TITLE */}
      <h3 className="mt-3 text-lg font-bold text-white leading-6 group-hover:text-indigo-400 transition">
        <Link href={`/blog/${id}`}>
          <span className="absolute inset-0" />
          {title}
        </Link>
      </h3>

      {/* 🔥 CTA (NEW - makes it premium) */}
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition">
        <span className="text-sm text-indigo-400 font-semibold">
          Read Article →
        </span>
      </div>
    </motion.article>
  );
}