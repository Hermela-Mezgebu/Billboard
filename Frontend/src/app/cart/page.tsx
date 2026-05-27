"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Billboard } from "@/types";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Billboard[]>([]);

  // ✅ LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  // ✅ REMOVE ITEM
  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ✅ TOTAL PRICE
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
          <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}