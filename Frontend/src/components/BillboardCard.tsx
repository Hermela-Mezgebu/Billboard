"use client";

import Image from "next/image";
import { Billboard } from "@/types";
import { useRouter } from "next/navigation";
export interface BillboardCardProps {
  billboard: Billboard;
  onClick?: (billboard: Billboard) => void;
  onScheduleClick?: (billboard: Billboard) => void; // 👈 ADD THIS
}

export default function BillboardCard({
  billboard,
  onClick,
  onScheduleClick,
}: BillboardCardProps) {
  


const router = useRouter();
  return (
    <div
      onClick={() => onClick?.(billboard)}
      className="w-full max-w-[22rem] border rounded-lg shadow bg-gray-800 border-gray-700 group cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative w-full h-48">
        <Image
          src={billboard.image?.trim() ? billboard.image : "/fallback.jpg"}
          alt={billboard.location}
          fill
          unoptimized
          loading="eager"
          className="object-cover rounded-lg"
        />
      </div>

      <div className="px-5 pb-5">
        {/* TITLE */}
        <h3 className="text-xl font-semibold text-white group-hover:text-blue-500">
          {billboard.location}
        </h3>

        <p className="text-sm text-white line-clamp-2">
          {billboard.description}
        </p>

        {/* TABLE */}
        <div className="relative my-2">
          <table className="w-full text-sm text-gray-400">
            <thead className="uppercase bg-gray-700">
              <tr>
                <th className="px-4 py-2">Screen</th>
                <th className="px-4 py-2">Size</th>
                <th className="px-4 py-2">Light</th>
              </tr>
            </thead>

            <tbody>
              <tr className="text-white">
                <td className="px-4 py-2">
                  {billboard.no_of_screens}
                </td>
                <td className="px-4 py-2">
                  {billboard.width} x {billboard.height}
                </td>
                <td className="px-4 py-2">
                  {billboard.light_type}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

<button
  onClick={(e) => {
    e.stopPropagation();
    router.push(`/billboards/${billboard.id}/schedule-screen`);
  }}
  className="block w-full bg-blue-500 text-white py-2 rounded-md mt-3 hover:bg-blue-600 cursor-pointer"
>
  Schedule
</button>
      </div>
    </div>
  );
}