"use client";

import { useState, useEffect } from "react";
import { ChevronDown, LayoutGrid, List as ListIcon } from "lucide-react";

import BillboardCard from "@/components/BillboardCard";
import { Pagination } from "@/components/Pagination";
import BillboardDetail from "@/components/BillboardDetail";
import { billboardData, type Billboard } from "@/types";
import { billboardService } from "@/services/api";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";

export default function ClientPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedBillboard, setSelectedBillboard] =
    useState<Billboard | null>(null);
  const [viewState, setViewState] = useState<"detail" | "schedule">("detail");
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [paginatedData, setPaginatedData] = useState<Billboard[]>([]); // ✅ FIX 1
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Digital", "Static", "Premium", "Smart"];

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        setLoading(true);
        const data = await billboardService.getPublicBillboards();

        const approvedBillboards = Array.isArray(data)
          ? data.filter((b: any) => b.status === "approved")
          : [];

        setBillboards(approvedBillboards);
      } catch (err) {
        console.error("Error fetching billboards:", err);
        setBillboards(billboardData);
      } finally {
        setLoading(false);
      }
    };

    fetchBillboards();
  }, []);

  // ✅ FILTER
  const filteredBillboards: Billboard[] =
    activeCategory === "All"
      ? billboards
      : billboards.filter((b) => b.category === activeCategory);

  // ✅ INITIAL PAGE LOAD (IMPORTANT)
  useEffect(() => {
    setPaginatedData(filteredBillboards.slice(0, 6));
  }, [filteredBillboards]);

  return (
    <div className="min-h-screen">
      <main>
        {selectedBillboard ? (
          <BillboardDetail
            billboard={selectedBillboard}
            onBack={() => {
              setSelectedBillboard(null);
              setViewState("detail");
            }}
          />
        ) : (
          <>
            {/* HERO */}
            <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[url('/img/billboard-1.jpg')] bg-cover bg-center" />

                <video
                  className="absolute w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                >
                  <source
                    src="https://res.cloudinary.com/dzag6yjuq/video/upload/v1778415411/billboard1_2_ds0bkn.mkv"
                    type="video/mp4"
                  />
                </video>
              </div>

              <div className="absolute inset-0 bg-black/60 -z-10" />

              <motion.div
                className="space-y-6 px-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl md:text-6xl font-black">
                  Outdoor Advertising Agency
                </h1>

                <h2 className="text-2xl md:text-4xl text-indigo-400">
                  Billboard Platform
                </h2>
              </motion.div>
            </section>

            {/* CONTENT */}
            <div className="mx-auto max-w-7xl px-4 py-12">
              {/* FILTERS */}
              <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:justify-between">
                <h2 className="text-3xl font-bold">Our Billboards</h2>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Categories */}
                  <div className="flex rounded-lg bg-slate-100 p-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-xs font-semibold",
                          activeCategory === cat
                            ? "bg-white text-indigo-600"
                            : "text-slate-500"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* View toggle */}
                  <div className="flex items-center gap-2 border p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={viewMode === "grid" ? "text-indigo-600" : ""}
                    >
                      <LayoutGrid size={18} />
                    </button>

                    <button
                      onClick={() => setViewMode("list")}
                      className={viewMode === "list" ? "text-indigo-600" : ""}
                    >
                      <ListIcon size={18} />
                    </button>
                  </div>

                  <button className="flex items-center gap-2 border px-3 py-1 rounded-lg">
                    Sort <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* GRID */}
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                <div
                  className={cn(
                    "grid gap-8",
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  )}
                >
                  {paginatedData.map((billboard: Billboard) => (
                    <BillboardCard
                      key={billboard.id}
                      billboard={billboard}
                      onClick={(b) => {
                        setSelectedBillboard(b);
                        setViewState("detail");
                      }}
                      onScheduleClick={(b) => {
                        setSelectedBillboard(b);
                        setViewState("schedule");
                      }}
                    />
                  ))}
                </div>
              )}

              {/* ✅ FIX 2: CONNECT PAGINATION */}
              <Pagination
                billboards={filteredBillboards}
                onChange={(data) => setPaginatedData(data)}
              />
            </div>
          </>
        )}
      </main>

      <FAQ />
      <Testimonials />
    </div>
  );
}