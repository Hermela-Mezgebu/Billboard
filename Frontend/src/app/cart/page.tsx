"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Billboard } from "@/types";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Billboard[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ LOAD CART
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  // ✅ HANDLE BOOKING (FIXED)
  const handleBooking = async () => {
    try {
      if (cartItems.length === 0) {
        return alert("Cart is empty");
      }

      setIsSubmitting(true);

      const res = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billboards: cartItems.map((item) => item.id), // ✅ FIXED (send all IDs)
        }),
      });

      const data = await res.json();

      // ✅ REDIRECT TO CHAPA
      if (data.checkout_url) {
        // clear cart before redirect
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("storage")); // update navbar

        window.location.href = data.checkout_url;
      } else {
        alert("Payment link not found");
      }

    } catch (err: any) {
      console.error(err);
      alert("Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ REMOVE ITEM
  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));

    // update navbar
    window.dispatchEvent(new Event("storage"));
  };

  // ✅ TOTAL
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.pricePerMonth || 0),
    0
  );

  return (
    <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <div className="grid gap-6">

          {/* ITEMS */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 items-center border p-4 rounded-xl"
            >
              {/* IMAGE */}
              <img
                src={item.image || "/placeholder.jpg"}
                className="w-32 h-24 object-cover rounded-lg"
              />

              {/* INFO */}
              <div className="flex-1">
                <h2 className="font-bold text-lg">
                  {item.title || "Billboard"}
                </h2>
                <p className="text-sm text-gray-500">{item.location}</p>
                <p className="text-indigo-600 font-bold mt-1">
                  ETB {item.pricePerMonth}
                </p>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
              >
                <Trash2 />
              </button>
            </div>
          ))}

          {/* TOTAL */}
          <div className="flex justify-between items-center mt-6 border-t pt-6">
            <h2 className="text-xl font-bold">Total</h2>
            <p className="text-2xl font-black text-indigo-600">
              ETB {total}
            </p>
          </div>

          {/* CHECKOUT */}
          <button
            onClick={handleBooking}
            disabled={isSubmitting}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      )}
    </div>
  );
}