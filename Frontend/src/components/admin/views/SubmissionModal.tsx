import { motion } from "framer-motion";
import { useState } from "react";

export function SubmissionModal({ sub, onClose }: any) {
  const [active, setActive] = useState(0);

  return (
    <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-2xl w-[700px]">

        {/* MAIN IMAGE */}
        <img
          src={sub.images?.[active]}
          className="w-full h-80 object-cover rounded-xl mb-4"
        />

        {/* GALLERY */}
        <div className="flex gap-2 mb-4">
          {sub.images?.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              onClick={() => setActive(i)}
              className={`w-20 h-16 rounded cursor-pointer border ${
                active === i ? "border-indigo-600" : ""
              }`}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold">{sub.location}</h2>
        <p className="text-sm text-slate-500">{sub.owner}</p>

        <button
          onClick={onClose}
          className="mt-4 text-slate-500"
        >
          Close
        </button>

      </div>
    </motion.div>
  );
}