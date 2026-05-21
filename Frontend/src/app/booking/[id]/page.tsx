"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { bookingService } from "@/services/api";
import { CheckCircle } from "lucide-react";
import QRCode from "react-qr-code";

export default function BookingPage() {
  const [data, setData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ LOAD DATA
  useEffect(() => {
    const stored = localStorage.getItem("booking_data");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        console.error("Invalid booking data");
      }
    }
  }, []);

  // ✅ BOOKING CODE
  const bookingCode = useMemo(() => {
    return "BB-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }, []);

  if (!data) {
    return <div className="text-white p-10">Loading booking...</div>;
  }

  // ✅ FINAL BOOKING
  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login first");
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append(
        "start_date",
        format(new Date(data.start), "yyyy-MM-dd")
      );

      form.append(
        "end_date",
        format(new Date(data.end), "yyyy-MM-dd")
      );

      form.append("amount", data.totalPrice.toString());
      form.append("booking_code", bookingCode);

      const res = await bookingService.createBooking(
        data.billboard.id,
        form
      );

      const paymentUrl =
        res?.checkout_url || res?.data?.checkout_url;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("No payment URL");
      }
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center px-4 py-10 text-white">
      <div className="w-full max-w-5xl bg-[#111827] rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
       <div className="flex flex-col items-center justify-center text-center p-8 border-b border-gray-800">
  <CheckCircle className="text-green-500 mb-3" size={50} />

  <h1 className="text-2xl font-bold">
    Booking Confirmation
  </h1>

  <p className="text-gray-400 text-sm mt-2 max-w-md">
    Your campaign is ready. Confirm and proceed to payment.
  </p>
</div>

        {/* MAIN CONTENT */}
        <div className="grid md:grid-cols-2">

          {/* LEFT → IMAGE */}
          <div className="bg-black">
            {data.image && (
              <img
                src={data.image}
                alt="Ad Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* RIGHT → DETAILS */}
          <div className="p-8 space-y-6">

            {/* BILLBOARD */}
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-gray-400">Billboard</span>
              <span className="font-semibold">
                {data.billboard.location}
              </span>
            </div>

            {/* DATES */}
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-gray-400">Start</span>
              <span>
                {format(new Date(data.start), "PPP")}
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-gray-400">End</span>
              <span>
                {format(new Date(data.end), "PPP")}
              </span>
            </div>

            {/* PRICE */}
            <div className="flex justify-between border-b border-gray-700 pb-3">
              <span className="text-gray-400">Total</span>
              <span className="text-green-400 font-bold text-lg">
                ${data.totalPrice}
              </span>
            </div>

            {/* BOOKING CODE */}
            <div className="text-center bg-[#0f172a] p-4 rounded-xl border border-blue-500">
              <p className="text-gray-400 text-sm">
                Booking Code
              </p>
              <p className="text-xl font-bold text-blue-400 tracking-widest">
                {bookingCode}
              </p>
            </div>

            {/* QR CODE */}
            <div className="flex flex-col items-center gap-3 mt-4">
              <p className="text-gray-400 text-sm">
                Scan Ticket
              </p>

              <div className="bg-white p-3 rounded-xl">
                <QRCode
                  value={JSON.stringify({
                    code: bookingCode,
                    billboard: data.billboard.location,
                    start: data.start,
                    end: data.end,
                    amount: data.totalPrice,
                  })}
                  size={120}
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleBooking}
              disabled={isSubmitting}
              className="w-full mt-6 bg-blue-600 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Confirm & Pay"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}