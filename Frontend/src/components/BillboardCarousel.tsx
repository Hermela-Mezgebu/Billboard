"use client";

import Link from "next/link";
import Image from "next/image";
import { Billboard } from "@/types";
import { useRouter } from "next/navigation";
interface BillboardCardProps {
  billboard: Billboard;
  onScheduleClick: (billboard: Billboard) => void;
  onClick?: (billboard: Billboard) => void;
}

export default function BillboardCard({
  billboard,
  onClick,
  onScheduleClick
}: BillboardCardProps) {
  const router = useRouter();
  return (
    <div
      onClick={() => onClick?.(billboard)}
      className="w-full max-w-[22rem] border rounded-lg shadow bg-gray-800 border-gray-700 group cursor-pointer"
    >
      {/* IMAGE */}
      <Link href={`/billboards/${billboard.id}`}>
       <div className="relative w-full h-48">
  <Image
    src={billboard.imageUrl?.trim() ? billboard.imageUrl : "/fallback.jpg"}
    alt={billboard.location}
    fill
    className="object-cover rounded-lg"
  />
</div>
      </Link>

      <div className="px-5 pb-5">
        {/* TITLE */}
        <Link
          href={`/billboards/${billboard.id}`}
          className="text-xl font-semibold text-white group-hover:text-blue-500"
        >
          {billboard.location}
        </Link>

        <p className="text-sm text-white">{billboard.description}</p>

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

        {/* BUTTON */}
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