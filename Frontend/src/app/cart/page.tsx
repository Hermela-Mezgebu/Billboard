"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  billboard_id: number;
  start_date: string | null;
  end_date: string | null;
  billboard: {
    id: number;
    title: string;
    location: string;
    image: string | null;
    price: number;
  };
  days: number;
  subtotal: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/api/cart", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setCart(data.cart || []);
        setGrandTotal(data.grand_total || 0);
      } else {
        setError(data.message || "Failed to load cart");
      }
    } catch {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`http://127.0.0.1:8000/api/cart/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      window.dispatchEvent(new Event("storage"));
      fetchCart();
    }
  };
const handleDateChange = async (
  id: number,
  field: "start_date" | "end_date",
  value: string
) => {
  // Create updated cart immediately
  const updatedCart = cart.map((item) =>
    item.id === id
      ? {
          ...item,
          [field]: value || null,
        }
      : item
  );

  setCart(updatedCart);

  const updatedItem = updatedCart.find((item) => item.id === id);

  if (!updatedItem) return;

  const startDate = updatedItem.start_date || "";
  const endDate = updatedItem.end_date || "";

  // Wait until both dates are selected
  if (!startDate || !endDate) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/cart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
      }),
    });

    if (res.ok) {
      fetchCart();
    }
  } catch (error) {
    console.error(error);
  }
};

  const handleCheckout = async () => {
    setCheckingOut(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in to checkout");
      setCheckingOut(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/cart/checkout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError(data.message || "Checkout failed");
      }
    } catch {
      setError("Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 max-w-4xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p className="text-gray-400">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      {cart.length === 0 && (
        <div>
          <p className="text-gray-400 mb-4">No items in cart</p>
          <button
            onClick={() => router.push("/billboards")}
            className="bg-indigo-600 px-6 py-3 rounded-xl text-white hover:bg-indigo-700"
          >
            Browse Billboards
          </button>
        </div>
      )}

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="bg-slate-800 p-4 rounded-xl">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="font-bold text-lg">{item.billboard.title || item.billboard.location}</h2>
                <p className="text-sm text-gray-400">{item.billboard.location}</p>
                <p className="text-indigo-400 font-semibold mt-1">
                  {item.billboard.price} ETB / day
                </p>

                <div className="flex gap-4 mt-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Start Date</label>
                    <input
                      type="date"
  value={item.start_date || ""}
  onChange={(e) => {
    console.log("START DATE:", e.target.value);
    handleDateChange(item.id, "start_date", e.target.value);
  }}
                      className="bg-slate-700 p-2 rounded-lg text-sm text-white border border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">End Date</label>
                    <input
                      type="date"
  value={item.end_date || ""}
  onChange={(e) => {
    console.log("END DATE:", e.target.value);
    handleDateChange(item.id, "end_date", e.target.value);
  }}
                      className="bg-slate-700 p-2 rounded-lg text-sm text-white border border-slate-600"
                    />
                  </div>
                </div>

                {item.days > 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    {item.days} day{item.days > 1 ? "s" : ""} &times; {item.billboard.price} ETB ={" "}
                    <span className="text-indigo-400 font-semibold">{item.subtotal} ETB</span>
                  </p>
                )}
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                className="ml-4 text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <>
          <div className="mt-8 text-2xl font-bold flex justify-between items-center border-t border-slate-700 pt-6">
            <span>Grand Total</span>
            <span className="text-indigo-400">{grandTotal} ETB</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="mt-6 w-full bg-indigo-600 py-3 rounded-xl font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingOut ? "Processing..." : "Proceed to Payment"}
          </button>
        </>
      )}
    </div>
  );
}
