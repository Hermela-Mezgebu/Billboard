"use client";

import React, { useEffect, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, startOfToday, differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";

import { Billboard } from "@/types";

interface SchedulingPageProps {
  billboard: Billboard;
  onBack: () => void;
  onContinue: (data: any) => void;
}

export default function SchedulingPage({
  billboard,
  onBack,
}: SchedulingPageProps) {
  const router = useRouter();

  // ===== STATES =====
  const [range, setRange] = useState<DateRange | undefined>();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [adLength, setAdLength] = useState(30);
  const [playsPerDay, setPlaysPerDay] = useState(40);

  const [totalPrice, setTotalPrice] = useState(0);

  const PRICE_PER_SECOND = 0.5;

  // ===== PRICE CALCULATION =====
  useEffect(() => {
    if (range?.from && range?.to) {
      const days = differenceInDays(range.to, range.from) + 1;

      const total =
        days * playsPerDay * adLength * PRICE_PER_SECOND;

      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [range, adLength, playsPerDay]);

  // ===== IMAGE HANDLER (BASE64 ✅)
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFile(f);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // ✅ correct
      };
      reader.readAsDataURL(f);
    }
  };

  // ===== BOOKING =====
  const handleBooking = () => {
    if (!billboard?.id) {
      alert("Billboard not loaded yet");
      return;
    }

    if (!range?.from || !range?.to) {
      alert("Please select dates");
      return;
    }

    if (!file) {
      alert("Please upload image");
      return;
    }

    if (adLength <= 0 || playsPerDay <= 0) {
      alert("Invalid input values");
      return;
    }

    // ✅ DEBUG
    console.log("SAVING IMAGE:", preview);

    // ✅ SAVE DATA
    const bookingData = {
      billboard,
      start: range.from.toISOString(),
      end: range.to.toISOString(),
      totalPrice,
      adLength,
      playsPerDay,
      image: preview, // ✅ base64 stored
    };

    localStorage.setItem("booking_data", JSON.stringify(bookingData));

    // ✅ GO TO BOOKING PAGE
    router.push(`/booking/${billboard.id}`);
  };

  // ===== LOADING =====
  if (!billboard) {
    return (
      <div className="text-white p-10">
        Loading billboard...
      </div>
    );
  }

  // ===== UI (UNCHANGED) =====
  return (
    <div className="bg-[#0b0e14] min-h-screen text-white p-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="bg-[#1a2029] p-6 rounded-3xl border border-gray-800">
          <img
            src={billboard.image || "/img/billboard-6.jpg"}
            className="w-full h-80 object-cover rounded-2xl"
          />

          <h2 className="text-3xl font-bold mt-6">
            {billboard.location}
          </h2>

          <p className="text-gray-400 mt-2">
            Active Window: 08:00 - 20:00
          </p>

          <div className="mt-6 bg-[#0f131a] p-5 rounded-2xl">
            <p className="text-sm text-gray-500 uppercase">
              Rate
            </p>
            <p className="text-2xl font-bold text-blue-400">
              ${PRICE_PER_SECOND}/sec
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-[#0f131a] p-8 rounded-3xl border border-gray-800">

          <h2 className="text-3xl font-bold mb-8">
            Schedule Campaign
          </h2>

          {/* DATE */}
          <div className="mb-6">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={{ before: startOfToday() }}
            />

            <p className="text-blue-400 mt-2">
              {range?.from && range?.to
                ? `${format(range.from, "PPP")} → ${format(range.to, "PPP")}`
                : "Select dates"}
            </p>
          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="number"
              min={1}
              value={adLength}
              onChange={(e) =>
                setAdLength(Number(e.target.value))
              }
              className="p-3 bg-[#1a2029] rounded-xl"
              placeholder="Ad Length"
            />

            <input
              type="number"
              min={1}
              value={playsPerDay}
              onChange={(e) =>
                setPlaysPerDay(Number(e.target.value))
              }
              className="p-3 bg-[#1a2029] rounded-xl"
              placeholder="Plays per day"
            />
          </div>

          {/* FILE */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="mb-4"
          />

          {preview && (
            <img
              src={preview}
              className="w-24 h-24 rounded"
            />
          )}

          {/* PRICE */}
          <div className="mt-6 p-4 bg-[#1a2029] rounded-xl">
            <p className="text-gray-400">Total</p>
            <h2 className="text-2xl text-green-400">
              ${totalPrice.toFixed(2)}
            </h2>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={onBack}
              className="w-1/3 bg-gray-700 p-3 rounded-xl"
            >
              Back
            </button>

            <button
              onClick={handleBooking}
              disabled={
                !range?.from ||
                !range?.to ||
                !file ||
                totalPrice <= 0
              }
              className="flex-1 bg-blue-600 p-3 rounded-xl disabled:opacity-50"
            >
              Book Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}