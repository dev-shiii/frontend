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
    // 🔥 FIX: isRegistered is a boolean, not a function
    if (!isRegistered) {
      alert("You are not registered. Please register first.");
      nav("/register");
      return;
    }

    // 🔥 FIX: isLoggedIn is a boolean, not a function
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

  return (
    <div className="relative min-h-screen p-6">
      {/* Background */}
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
                bg-white/10
                backdrop-blur-md
                border border-white/20
                rounded-xl
                p-6
                shadow-xl
                text-white
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
                    className="
                      flex items-center gap-4 
                      bg-white/10 
                      backdrop-blur-sm 
                      border border-white/10
                      p-3 
                      rounded-lg 
                      shadow-md
                    "
                  >
                    {/* Item Image */}
                    <img
                      src={item.productId?.image}
                      alt={item.productId?.name}
                      className="w-16 h-16 rounded-lg object-cover shadow"
                    />

                    {/* Item Info */}
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
