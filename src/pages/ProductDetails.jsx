import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import useRequireAuth from "../hooks/useRequireAuth";
import { motion } from "framer-motion";
import ThreeWavyBackground from "../components/ThreeWavyBackground";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // ⭐ USER LOCATION
  const [userLocation, setUserLocation] = useState(null);

  // ⭐ DISTANCE RESULT
  const [distance, setDistance] = useState(null);

  const { addToCart } = useContext(CartContext);
  const { check } = useRequireAuth();
  const nav = useNavigate();

  // ⭐ Haversine Distance Formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in KM
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const load = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product || res.data);
    } catch (err) {
      console.error("Failed to load product", err);
    }
  };

  // ⭐ ASK LOCATION ON PAGE LOAD
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => console.warn("User denied location access")
    );
  }, []);

  // ⭐ IF PRODUCT + LOCATION → CALCULATE DISTANCE
  useEffect(() => {
    if (product && userLocation && product.location) {
      const d = getDistance(
        userLocation.lat,
        userLocation.lng,
        product.location.lat,
        product.location.lng
      );

      setDistance(d.toFixed(2)); // round to 2 decimals
    }
  }, [product, userLocation]);

  useEffect(() => {
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!check("add to cart")) return;
    try {
      await addToCart(product._id);
      alert("Added to cart");
    } catch (err) {
      console.error("Add to cart error", err);
      alert("Failed to add to cart");
    }
  };

  const handleOrderNow = () => {
    if (!check("order")) return;
    nav(`/order/${product._id}/pay`);
  };

  if (!product)
    return (
      <div className="relative flex justify-center items-center min-h-screen text-white text-xl">
        <ThreeWavyBackground />
        Loading...
      </div>
    );

  return (
    <div className="relative min-h-screen flex justify-center items-center p-4">
      <ThreeWavyBackground />

      <motion.div
        className="
          bg-white/10
          backdrop-blur-lg
          border border-white/20
          shadow-2xl
          rounded-2xl
          p-8
          max-w-3xl
          w-full
          flex flex-col md:flex-row
          gap-8
          text-white
          z-10
        "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* IMAGE */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 rounded-xl shadow-xl object-cover"
        />

        {/* DETAILS */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{product.name}</h2>

          <p className="text-xl font-semibold text-green-300">
            ₹{product.price}
          </p>

          {/* ⭐ DISTANCE DISPLAY */}
          {distance && (
            <p className="text-yellow-300 text-lg">
              📍 <strong>{distance} km away from you</strong>
            </p>
          )}

          {product.description && (
            <p className="text-gray-200 leading-relaxed">{product.description}</p>
          )}

          {/* BUTTONS */}
          <div className="flex flex-col gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow active:scale-95"
            >
              Add to Cart
            </button>

            <button
              onClick={handleOrderNow}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow active:scale-95"
            >
              Order Now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
