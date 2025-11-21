import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import ThreeWavyBackground from "../components/ThreeWavyBackground";

export default function OrderPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [product, setProduct] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    };
    load();
  }, [id]);

  const placeOrder = async () => {
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
      alert("Please fill all address fields");
      return;
    }

    try {
      const res = await api.post("/orders", {
        items: [{ productId: id, quantity: 1, price: product.price }],
        totalAmount: product.price,
        paymentMethod,
        shippingAddress: address,
      });

      alert("Order placed! Invoice is being emailed to you.");
      nav(`/order/${res.data.order._id}`);
    } catch (err) {
      console.error("Order Error:", err.response || err);
      alert("Failed to place order");
    }
  };

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="relative min-h-screen flex justify-center items-center px-4">
      <ThreeWavyBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          bg-white/10 backdrop-blur-lg border border-white/20
          shadow-2xl rounded-2xl p-8 w-full max-w-xl text-white z-10
        "
      >
        {/* HEADER */}
        <h2 className="text-3xl font-bold text-center mb-8 drop-shadow-lg">
          Checkout
        </h2>

        {/* PRODUCT CARD */}
        <div className="flex items-center gap-5 mb-8 bg-white/10 p-4 rounded-xl border border-white/20 shadow-lg">
          <img
            src={product.image}
            className="w-24 h-24 rounded-xl object-cover shadow"
            alt={product.name}
          />

          <div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-green-300 font-medium text-lg">
              ₹{product.price}
            </p>
          </div>
        </div>

        {/* SHIPPING ADDRESS */}
        <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            placeholder="Full Name"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg 
                       placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            placeholder="Phone"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg 
                       placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            placeholder="Street Address"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg sm:col-span-2
                       placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            placeholder="City"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg 
                       placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            placeholder="State"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg 
                       placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            placeholder="Pincode"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg 
                       placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* PAYMENT METHOD */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Payment Method</h3>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg 
                     text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="cod" className="text-black">Cash on Delivery</option>
          <option value="card" className="text-black">Card</option>
          <option value="upi" className="text-black">UPI</option>
        </select>

        {/* BUTTON */}
        <button
          onClick={placeOrder}
          className="
            w-full mt-8 py-3 rounded-lg text-lg font-semibold
            bg-blue-600 hover:bg-blue-700 transition shadow-lg active:scale-95
          "
        >
          Place Order
        </button>
      </motion.div>
    </div>
  );
}
