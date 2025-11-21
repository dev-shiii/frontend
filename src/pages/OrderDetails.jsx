import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import ThreeWavyBackground from "../components/ThreeWavyBackground";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const load = async () => {
    const res = await api.get(`/orders/${id}`);
    setOrder(res.data.order);
  };

  useEffect(() => {
    load();
  }, []);

  if (!order)
    return (
      <div className="relative flex justify-center items-center min-h-screen text-white text-xl">
        <ThreeWavyBackground />
        Loading order...
      </div>
    );

  return (
    <div className="relative min-h-screen px-6 py-10">

      {/* ⭐ Background */}
      <ThreeWavyBackground />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Title */}
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold text-white mb-6 drop-shadow-lg"
        >
          Order Details
        </motion.h2>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            bg-white/10 
            backdrop-blur-md 
            border border-white/20
            p-6 
            shadow-xl 
            rounded-xl 
            mb-8 
            text-white
          "
        >
          <p className="text-lg">
            <strong>Order ID:</strong> {order._id}
          </p>

          <p className="text-lg mt-2">
            <strong>Total Items:</strong> {order.items.length}
          </p>

          <p className="text-lg mt-2">
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>

          <p className="text-lg mt-2">
            <strong>Status:</strong>{" "}
            <span className="text-green-300 font-semibold">{order.status}</span>
          </p>
        </motion.div>

        {/* Items Title */}
        <h3 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">
          Items
        </h3>

        {/* Items */}
        <div className="space-y-4">
          {order.items.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="
                flex items-center gap-4 
                bg-white/10 
                backdrop-blur-md
                border border-white/20
                p-4 
                rounded-lg 
                shadow-md 
                text-white
              "
            >
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="w-20 h-20 object-cover rounded"
              />

              <div>
                <h4 className="text-lg font-semibold">{item.productId.name}</h4>
                <p className="text-gray-200">Quantity: {item.quantity}</p>
                <p className="text-blue-300 font-bold">
                  Price: ${item.productId.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
