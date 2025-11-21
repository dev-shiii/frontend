import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ThreeWavyBackground from "../components/ThreeWavyBackground";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const nav = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    // Basic validation
    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      alert("Please fill all address fields");
      return;
    }

    const items = cart.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);

    try {
      setLoading(true);
      const res = await api.post("/orders", {
        items,
        totalAmount,
        paymentMethod,
        shippingAddress: address,
      });

      // Backend returns { message, order }
      const order = res.data?.order;
      // Clear cart on backend + frontend
      try {
        await clearCart(); // this calls POST /cart/clear
      } catch (err) {
        // ignore clearCart failure, we've already placed the order
        console.warn("Clear cart failed", err);
      }

      alert("Order placed! Invoice will be emailed to your account.");
      nav(`/order/${order._id}`);
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center px-6 py-10">
      <ThreeWavyBackground />

      <div
        className="
          bg-white/10 
          backdrop-blur-xl 
          border border-white/20 
          p-8 
          rounded-2xl 
          shadow-2xl 
          w-full 
          max-w-2xl 
          text-white 
          z-10
        "
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-300">
          Checkout
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Full Name"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            className="p-3 bg-white/10 rounded border border-white/20"
          />
          <input
            placeholder="Phone"
            value={address.phone}
            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            className="p-3 bg-white/10 rounded border border-white/20"
          />
          <input
            placeholder="Street"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="p-3 bg-white/10 rounded border border-white/20 sm:col-span-2"
          />
          <input
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="p-3 bg-white/10 rounded border border-white/20"
          />
          <input
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="p-3 bg-white/10 rounded border border-white/20"
          />
          <input
            placeholder="Pincode"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            className="p-3 bg-white/10 rounded border border-white/20"
          />
        </div>

        <label className="block mb-2">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-3 mb-6 bg-white/10 rounded border border-white/20"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg"
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
