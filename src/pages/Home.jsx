import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ⭐ ADDED
import api from "../services/api";

import ProductCard from "../components/ProductCard";
import ThreeWavyBackground from "../components/ThreeWavyBackground";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate(); // ⭐ ADDED

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Load all products
  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  // Ask for user location on Home page (optional)
  useEffect(() => {
    load();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("User location allowed:", pos.coords);
      },
      (err) => {
        console.warn("Location permission denied", err);
      }
    );
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ------------------------------
        LOADING SPINNER
  -------------------------------- */
  if (loading) {
    return (
      <div className="relative">
        <ThreeWavyBackground />
        <div className="flex justify-center items-center h-96 relative z-10">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ThreeWavyBackground intensity={0.9} speed={0.6} color={0x0e1b33} />

      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold text-white drop-shadow mb-6"
        >
          All Products
        </motion.h2>

        {/* ⭐ NEARBY PRODUCTS MAP BUTTON (NEW BEHAVIOR) */}
        <button
          onClick={() => navigate("/nearby")}    // ⭐ CHANGED
          className="mb-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-lg"
        >
          📍 Show Nearby Products on Map
        </button>

        {/* Search Bar */}
        <motion.input
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          type="text"
          placeholder="Search products..."
          className="w-full p-3 border rounded-lg shadow-sm mb-8 bg-white/90 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* All Products */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <motion.div
                key={p._id}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 },
                }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))
          ) : (
            <p className="text-gray-200 text-lg">No products found.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
