"use client";

import AdvancedVerticalScroller from "@/components/AdvancedVerticalScroller";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ServicesPage() {
  return (
    <main className="bg-slate-950 text-white">

   

      {/* 🔥 MAIN CONTENT */}
      <section className="relative z-10 px-6 md:px-32 py-24">
        <div className="max-w-6xl mx-auto space-y-24">

          {/* ROW 1 */}
          <div className="flex md:flex-row flex-col gap-6 items-center">
            <Image
              src="/img/billboard-6.jpg"
              alt="billboard"
              width={800}
              height={600}
              className="md:w-1/2 w-full rounded-lg object-cover"
            />

            <div className="md:w-1/2 text-gray-400 space-y-4">
              <h2 className="text-3xl font-semibold text-white">
                Premium Billboard Advertising
              </h2>
              <p>
                Reach thousands daily with strategic billboard placements and
                high-impact visual campaigns across prime locations.
              </p>
            </div>
          </div>

          {/* ROW 2 */}
          <div className="flex md:flex-row flex-col-reverse gap-6 items-center">
            <div className="md:w-1/2 text-gray-400 space-y-4">
              <h2 className="text-3xl font-semibold text-white">
                Smart Campaign Optimization
              </h2>
              <p>
                Use analytics, automation, and performance tracking to maximize
                engagement and ROI.
              </p>
            </div>

            <Image
              src="/img/billboard-6.jpg"
              alt="billboard"
              width={800}
              height={600}
              className="md:w-1/2 w-full rounded-lg object-cover"
            />
          </div>

           {/* ROW 1 */}
          <div className="flex md:flex-row flex-col gap-6 items-center">
            <Image
              src="/img/billboard-6.jpg"
              alt="billboard"
              width={800}
              height={600}
              className="md:w-1/2 w-full rounded-lg object-cover"
            />

            <div className="md:w-1/2 text-gray-400 space-y-4">
              <h2 className="text-3xl font-semibold text-white">
                Premium Billboard Advertising
              </h2>
              <p>
                Reach thousands daily with strategic billboard placements and
                high-impact visual campaigns across prime locations.
              </p>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center space-y-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold">
              Start Your Billboard Campaign Today
            </h2>

            <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
              Get Started
            </button>
          </motion.div>

        </div>
      </section>

    </main>
  );
}