import React, { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ThreeWavyBackground from "../components/ThreeWavyBackground";

export default function Orders() {
  const { isRegistered, isLoggedIn } = useContext(AuthContext);
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.log("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isRegistered) {
      alert("You are not registered. Please register first.");
      nav("/register");
      return;
    }

    if (!isLoggedIn) {
      alert("Please log in to continue.");
      nav("/login");
      return;
    }

    loadOrders();
  }, []);

  if (loading)
    return (
      <div className="relative min-h-screen flex justify-center items-center text-white text-xl">
        <ThreeWavyBackground />
        Loading orders...
      </div>
    );

  /* ⭐ FIXED — Secure Invoice Download */
  const downloadInvoice = async (orderId) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/orders/${orderId}/invoice`;
      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Invoice download error:", err);
      alert("Failed to download invoice. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen p-6">
      <ThreeWavyBackground />

      <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-lg relative z-10">
        Your Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-lg text-gray-200 relative z-10">
          No orders found.
        </p>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto relative z-10">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              className="
                bg-white/10 backdrop-blur-md border border-white/20
                rounded-xl p-6 shadow-xl text-white
              "
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Order Header */}
              <div className="mb-4">
                <h3 className="text-xl font-bold">Order #{order._id}</h3>

                <p className="text-sm text-gray-300">
                  Status:{" "}
                  <span className="font-semibold capitalize text-green-300">
                    {order.status}
                  </span>
                </p>

                <p className="text-sm text-gray-300">
                  Total Amount:{" "}
                  <span className="font-semibold text-green-400">
                    ₹{order.totalAmount}
                  </span>
                </p>
              </div>

              {/* Items List */}
              <h4 className="text-lg font-semibold mb-3">Items:</h4>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 bg-white/10 
                               backdrop-blur-sm border border-white/10
                               p-3 rounded-lg shadow-md"
                  >
                    <img
                      src={item.productId?.image}
                      alt={item.productId?.name}
                      className="w-16 h-16 rounded-lg object-cover shadow"
                    />

                    <div>
                      <p className="font-semibold text-white">
                        {item.productId?.name}
                      </p>

                      <p className="text-gray-300 text-sm">
                        Qty: {item.quantity}
                      </p>

                      <p className="text-gray-300 text-sm">
                        Price: ₹{item.productId?.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ⭐ DOWNLOAD BUTTON */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => downloadInvoice(order._id)}
                  className="
                    px-4 py-2 bg-blue-600 hover:bg-blue-700
                    text-white rounded-lg shadow transition
                  "
                >
                  Download Invoice
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
