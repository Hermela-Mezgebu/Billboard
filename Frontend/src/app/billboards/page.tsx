"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Map as MapIcon,
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  MapPin,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { billboardData } from "@/data/billboardData";
import type { Billboard } from "@/types";
import BillboardCard from "@/components/BillboardCard";
import { cn } from "@/lib/utils";

interface BillboardsProps {
  onSelect: (billboard: Billboard) => void;
}

export default function Billboards({ onSelect }: BillboardsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ["All", "Digital", "Static", "Premium", "Smart"];

  // AI Suggestion
  const aiSuggestion = useMemo(() => {
    if (!searchQuery) return null;
    return `AI Suggestion: Try "${searchQuery} Premium" or high-traffic areas`;
  }, [searchQuery]);

  // Filtering
  const filtered = useMemo(() => {
    return billboardData.filter((b) => {
      const matchesSearch =
        b.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || b.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="relative overflow-hidden">
      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px] animate-pulse" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* HEADER */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase mb-3">
            <TrendingUp size={16} />
            Marketplace
          </div>

          <h1 className="text-5xl font-black text-white">
            Find the Perfect <span className="text-indigo-600">Spot.</span>
          </h1>

          <p className="mt-4 text-lg text-gray-400">
            Discover premium billboard locations.
          </p>
        </div>

        {/* SEARCH */}
        <div className="sticky top-16 z-30 mb-8 backdrop-blur-xl border-b p-4 flex flex-col gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-4 w-full max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search billboard location..."
                className="w-full rounded-2xl border px-10 py-3 bg-black text-white"
              />
            </div>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 border px-4 py-3 rounded-xl"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex gap-2 bg-gray-800 p-1 rounded-xl">
            <ViewToggle
              active={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              icon={<LayoutGrid size={18} />}
            />
            <ViewToggle
              active={viewMode === "list"}
              onClick={() => setViewMode("list")}
              icon={<ListIcon size={18} />}
            />
            <ViewToggle
              active={viewMode === "map"}
              onClick={() => setViewMode("map")}
              icon={<MapIcon size={18} />}
            />
          </div>
        </div>

        {/* AI SUGGESTION */}
        {aiSuggestion && (
          <motion.div className="mb-6 p-4 rounded-xl bg-indigo-600/20 text-indigo-300 flex items-center gap-2">
            <Sparkles size={16} />
            {aiSuggestion}
          </motion.div>
        )}

        {/* FILTER */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div className="mb-8 p-6 bg-gray-800 rounded-xl">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-lg",
                      activeCategory === cat
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CONTENT */}
        <div className="min-h-[400px]">
          {viewMode === "map" ? (
            <div className="h-[400px] flex items-center justify-center border rounded-xl">
              <MapPin size={80} className="text-indigo-500 animate-bounce" />
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-8",
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {filtered.map((billboard) => (
                <motion.div key={billboard.id} whileHover={{ scale: 1.03 }}>
     <BillboardCard
  key={billboard.id}
  billboard={billboard}
/>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-20 p-8 rounded-3xl bg-indigo-600 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Need help choosing?</h3>
            <p className="text-indigo-200">
              Our AI suggests the best billboard.
            </p>
          </div>

          <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold">
            Get AI Recommendation
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewToggle({ active, onClick, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg",
        active ? "bg-white text-indigo-600" : "text-gray-400"
      )}
    >
      {icon}
    </button>
  );
}