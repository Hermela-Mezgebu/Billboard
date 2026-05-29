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
  const [paginatedData, setPaginatedData] = useState<Billboard[]>([]);

  const router = useRouter();

  const [selectedBillboard, setSelectedBillboard] =
    useState<Billboard | null>(null);

  const [viewState, setViewState] = useState<"detail" | "schedule">("detail");

  const categories = ["All", "Digital", "Static", "Premium", "Smart"];

  // ✅ FETCH
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

      const data = await res.json();

      const BASE_URL = "http://127.0.0.1:8000";

      const normalized = data.map((b: any) => ({
        id: b.id,
        title: b.title || "Billboard",
        location: b.location || "",

        image: b.image
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

  // ✅ FILTER
  const filteredBillboards = useMemo(() => {
    return billboards.filter((b) => {
      return (
        activeCategory === "All" ||
        b.category.toLowerCase() === activeCategory.toLowerCase()
      );
    });
  }, [billboards, activeCategory]);

  // ✅ UPDATE pagination when filter changes
  useEffect(() => {
    setPaginatedData(filteredBillboards);
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
            <section className="relative h-screen flex items-center justify-center text-white">
              <div className="absolute inset-0 bg-[url('/img/billboard-1.jpg')] bg-cover" />
              <div className="absolute inset-0 bg-black/60" />

              <motion.div
                className="text-center z-10"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-5xl font-bold">
                  Outdoor Advertising Agency
                </h1>

                <button
                  onClick={() => router.push("/billboards")}
                  className="mt-6 bg-indigo-600 px-6 py-3 rounded-xl"
                >
                  Explore Billboards
                </button>
              </motion.div>
            </section>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex justify-between mb-8">
                <h2 className="text-3xl font-bold">Our Billboards</h2>

                <div className="flex gap-2">
                  <button onClick={() => setViewMode("grid")}>
                    <LayoutGrid />
                  </button>
                  <button onClick={() => setViewMode("list")}>
                    <ListIcon />
                  </button>
                </div>
              </div>

              {/* CATEGORY */}
              <div className="flex gap-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-3 py-1 rounded",
                      activeCategory === cat && "bg-indigo-600 text-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* GRID */}
              {loading ? (
                <p>Loading...</p>
              ) : paginatedData.length === 0 ? (
                <p>No billboards found</p>
              ) : (
                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  )}
                >
                  {paginatedData.map((b) => (
                    <BillboardCard
                      key={b.id}
                      billboard={b}
                      onClick={() => {
                        setSelectedBillboard(b);
                        setViewState("detail");
                      }}
                      onScheduleClick={() => {
                        setSelectedBillboard(b);
                        setViewState("schedule");
                      }}
                    />
                  ))}
                </div>
              )}

              {/* PAGINATION */}
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