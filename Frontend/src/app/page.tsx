"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, LayoutGrid, List as ListIcon } from "lucide-react";

import BillboardCard from "@/components/BillboardCard";
import { Pagination } from "@/components/Pagination";
import BillboardDetail from "@/components/BillboardDetail";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import { useRouter } from "next/navigation";
import { Billboard } from "@/types";


export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
 const [paginatedData, setPaginatedData] = useState<Billboard[]>([]);
  const [selectedBillboard, setSelectedBillboard] =
    useState<Billboard | null>(null);

  const [viewState, setViewState] = useState<"detail" | "schedule">("detail");

  const categories = ["All", "Digital", "Static", "Premium", "Smart"];

  // ✅ FETCH APPROVED BILLBOARDS
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/billboards?status=approved"
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("API ERROR:", text);
          throw new Error("Failed to fetch");
        }

        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : raw?.data || [];

    const BASE_URL = "http://127.0.0.1:8000";

const normalized = data.map((b: any) => ({
  id: b.id,
  title: b.title || "Billboard",
  location: b.location || "",

  // ✅ FIX IMAGE URL
  image:
    b.image
      ? `${BASE_URL}/storage/${b.image}`
      : b.image_url
      ? b.image_url
      : Array.isArray(b.images) && b.images.length > 0
      ? `${BASE_URL}/storage/${b.images[0]}`
      : "/placeholder.jpg",

  neighborhood: b.neighborhood || b.location || "Unknown Area",
  description: b.description || "No description available",
  pricePerMonth: Number(b.price || 1000),

  category: b.type || "Digital",
}));

        setBillboards(normalized);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ✅ FILTER REAL DATA
  const filteredBillboards = useMemo(() => {
    return billboards.filter((b) => {
      return (
        activeCategory === "All" ||
        b.category.toLowerCase() === activeCategory.toLowerCase()
      );
    });
  }, [billboards, activeCategory]);

  return (
    <div className="min-h-screen">
      <main>
        {/* DETAIL VIEW */}
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
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black">
                  Outdoor Advertising Agency
                </h1>

                <h2 className="text-2xl md:text-4xl text-indigo-400 font-semibold">
                  Billboard Platform
                </h2>

                <button
                  onClick={() => router.push("/billboards")}
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold cursor-pointer"
                >
                  Explore Billboards
                </button>
              </motion.div>
            </section>

            {/* CONTENT */}
            <div className="mx-auto max-w-7xl px-4 py-12">
              <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:justify-between">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Our Billboards
                </h2>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Categories */}
                  <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
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

                  {/* Sort */}
                  <button className="flex items-center gap-2 border px-3 py-1 rounded-lg">
                    Sort <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* GRID */}
              {loading ? (
                <p className="text-center text-gray-400">Loading...</p>
              ) : filteredBillboards.length === 0 ? (
                <p className="text-center text-gray-400">
                  No approved billboards available
                </p>
              ) : (
                <div
                  className={cn(
                    "grid gap-8",
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  )}
                >
                {paginatedData.map((billboard) => (
  <BillboardCard
    key={billboard.id}
    billboard={billboard}
    onClick={(b: any) => {
      setSelectedBillboard({
        id: b.id,
        title: b.title || "Billboard",
        location: b.location || "",
        image: b.image || "/placeholder.jpg",
        neighborhood: b.neighborhood || b.location || "Unknown Area",
        description: b.description || "No description available",
        pricePerMonth: Number(b.pricePerMonth || b.price || 0),
        category: b.category || "Digital",
      });
      setViewState("detail");
    }}
  
    onScheduleClick={(b: any) => {
      setSelectedBillboard({
        id: b.id,
        title: b.title || "Billboard",
        location: b.location || "",
        image: b.image || "/placeholder.jpg",
        neighborhood: b.neighborhood || b.location || "Unknown Area",
        description: b.description || "No description available",
        pricePerMonth: Number(b.pricePerMonth || b.price || 0),
        category: b.category || "Digital",
      });
      setViewState("schedule");
    }}
  />
))}
                </div>
              )}

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