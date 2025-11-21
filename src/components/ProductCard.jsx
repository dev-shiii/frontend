import { Link } from "react-router-dom";
import { useContext } from "react";
import { CompareContext } from "../context/CompareContext";

export default function ProductCard({ product }) {
  const fallback =
    "https://via.placeholder.com/800x450.png?text=No+Image+Available";

  // Compare Context
  const { compareList, addToCompare, removeFromCompare } =
    useContext(CompareContext);

  const isCompared = compareList.some((p) => p._id === product._id);

  return (
    <div className="border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white/10 backdrop-blur-lg text-white">
      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallback;
        }}
        className="w-full h-48 object-cover rounded-md"
      />

      {/* Name */}
      <h3 className="mt-3 text-lg font-semibold">{product.name}</h3>

      {/* Price */}
      <p className="text-gray-300">${product.price}</p>

      {/* View Details Button */}
      <Link
        to={`/products/${product._id}`}
        className="
          inline-block 
          mt-3 
          bg-blue-600 
          text-white 
          px-4 
          py-2 
          rounded-md 
          text-sm 
          font-medium 
          hover:bg-blue-700 
          transition
        "
      >
        View Details
      </Link>

      {/* Compare Button */}
      <button
        onClick={() =>
          isCompared
            ? removeFromCompare(product._id)
            : addToCompare(product)
        }
        className="
          mt-3
          w-full
          border
          border-blue-400
          text-blue-300
          rounded-md
          py-2
          font-medium
          hover:bg-blue-500/20
          transition
        "
      >
        {isCompared ? "Remove from Compare" : "Compare"}
      </button>
    </div>
  );
}
