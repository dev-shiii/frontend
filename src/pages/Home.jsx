import { useState, useEffect } from "react";
import api from "../services/api";

import ProductCard from "../components/ProductCard";
import ThreeWavyBackground from "../components/ThreeWavyBackground"; // ⬅ ADD THIS
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      console.log("Home products:", res.data.products);
      setProducts(res.data.products);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
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
        {/* Background */}
        <ThreeWavyBackground />

        {/* Loader */}
        <div className="flex justify-center items-center h-96 z-10 relative">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">

      {/* ⬅ 3D Wavy Background */}
      <ThreeWavyBackground intensity={0.9} speed={0.6} color={0x0e1b33} />

      {/* Foreground Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold text-white drop-shadow mb-6"
        >
          All Products
        </motion.h2>

        {/* Search Bar */}
        <motion.input
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          type="text"
          placeholder="Search products..."
          className="
              w-full p-3 
              border rounded-lg shadow-sm mb-8 
              bg-white/90 backdrop-blur 
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Product Grid */}
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
