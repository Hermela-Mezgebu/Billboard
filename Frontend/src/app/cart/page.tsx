"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ LOAD CART
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    const items = stored ? JSON.parse(stored) : [];
    setCart(items);
  }, []);

  // ✅ REMOVE ITEM
  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ✅ CALCULATE DAYS
  const getDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    return diff > 0 ? diff : 0;
  };

  // ✅ TOTAL
  const total = cart.reduce((sum, item) => {
    return sum + item.price * getDays();
  }, 0);

  // ✅ BOOKING
  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Select dates first");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // 👉 loop bookings (multi billboard)
      for (let item of cart) {
        const res = await fetch("http://127.0.0.1:8000/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            billboard_id: item.id,
            amount: item.price * getDays(),
            start_date: startDate,
            end_date: endDate,
          }),
        });

        const text = await res.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          console.error(text);
          throw new Error("Invalid response");
        }

        if (!res.ok) {
          throw new Error(data.message || "Booking failed");
        }

        // ✅ redirect to chapa
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
          return;
        }
      }

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto text-white">

      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 && (
        <p className="text-gray-400">No items in cart</p>
      )}

      {/* ITEMS */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between bg-slate-800 p-4 rounded-xl"
          >
            <div>
              <h2 className="font-bold">{item.title}</h2>
              <p className="text-sm text-gray-400">{item.location}</p>
              <p className="text-indigo-400">{item.price} ETB / day</p>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* DATE PICKER */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-slate-800 p-3 rounded-xl"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-slate-800 p-3 rounded-xl"
        />
      </div>

      {/* TOTAL */}
      <div className="mt-6 text-xl">
        Total: <span className="text-indigo-400">{total} ETB</span>
      </div>

      {/* BOOK BUTTON */}
      <button
        onClick={handleBooking}
        disabled={loading}
        className="mt-6 w-full bg-indigo-600 py-3 rounded-xl"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
}