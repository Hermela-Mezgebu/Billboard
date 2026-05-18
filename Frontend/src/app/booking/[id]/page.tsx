"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { differenceInDays, format, startOfToday } from "date-fns";
import axios from "axios";
import { bookingService } from "@/services/api";

interface BookingPageProps {
  params: {
    id: string;
  };
}

export default function BookingPage({ params }: BookingPageProps) {
  const id = params?.id;

  const [range, setRange] = useState<DateRange | undefined>();
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const pricePerDay = 50;

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🚨 SAFETY CHECK (prevents /undefined API calls)
  useEffect(() => {
    if (!id) return;
  }, [id]);

  // 🔥 FETCH BOOKED DATES
  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://127.0.0.1:8000/api/billboards/${id}/schedule-screen`)
      .then((res) => {
        const dates = res.data.map((d: string) => new Date(d));
        setDisabledDates(dates);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err.response?.data || err);
      });
  }, [id]);

  // 🔥 TOTAL PRICE
  const total = useMemo(() => {
    if (range?.from && range?.to) {
      const days = differenceInDays(range.to, range.from) + 1;
      return days * pricePerDay;
    }
    return 0;
  }, [range]);

  // 🔥 IMAGE PREVIEW
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🔥 BOOKING FUNCTION (FIXED)
  const handleBooking = async () => {
    if (!id) {
      alert("Invalid billboard ID");
      return;
    }

    if (!range?.from || !range?.to) {
      alert("Please select a date range");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in");
      return;
    }

    if (!image) {
      alert("Please upload an ad image");
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("start_date", format(range.from, "yyyy-MM-dd"));
      form.append("end_date", format(range.to, "yyyy-MM-dd"));
      form.append("amount", total.toString());
      form.append("image", image);

      const res = await bookingService.createBooking(id, form);

      console.log("BOOKING RESPONSE:", res);

      // ✅ SAFE PAYMENT REDIRECT HANDLING
      const paymentUrl =
        res?.payment_url ||
        res?.data?.payment_url ||
        res?.checkout_url ||
        res?.data?.checkout_url;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Booking successful but no payment URL returned.");
        window.location.href = "/client";
      }
    } catch (err: any) {
      console.error("FULL ERROR:", err.response?.data || err);

      const backendError = err.response?.data;

      if (backendError?.errors) {
        alert(
          Object.entries(backendError.errors)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        );
      } else {
        alert(
          backendError?.message ||
            err.message ||
            "Booking failed. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Book Billboard #{id}</h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* CALENDAR */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={[
              { before: startOfToday() },
              ...disabledDates,
            ]}
          />
        </div>

        {/* DETAILS */}
        <div className="flex-1">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>

            <p>
              Start:{" "}
              <span className="text-blue-400">
                {range?.from ? format(range.from, "PPP") : "---"}
              </span>
            </p>

            <p>
              End:{" "}
              <span className="text-blue-400">
                {range?.to ? format(range.to, "PPP") : "---"}
              </span>
            </p>

            <h2 className="text-2xl font-bold text-green-400 mt-4">
              Total: ${total}
            </h2>

            {/* IMAGE */}
            <div className="mt-6">
              <label className="block text-sm mb-2">Upload Ad Image</label>
              <input type="file" onChange={handleImage} />

              {preview && (
                <Image
                  src={preview}
                  alt="preview"
                  width={160}
                  height={160}
                  className="w-40 rounded mt-3"
                  unoptimized
                />
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={handleBooking}
              disabled={!range?.from || !range?.to || isSubmitting}
              className="w-full bg-blue-600 py-3 rounded-lg font-bold mt-6 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}