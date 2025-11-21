import { useContext } from "react";
import { CompareContext } from "../context/CompareContext";
import { useNavigate } from "react-router-dom";

export default function Compare() {
  const { compareList, clearCompare } = useContext(CompareContext);
  const nav = useNavigate();

  if (compareList.length < 2)
    return (
      <div className="min-h-screen bg-black text-gray-400 flex justify-center items-center text-xl">
        Select 2 products to compare.
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white px-10 py-12">
      <h1 className="text-4xl font-bold mb-10">Compare Products</h1>

      <div className="grid grid-cols-2 gap-10 mb-20">
        {compareList.map((p) => (
          <div
            key={p._id}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-gray-700 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-3 text-blue-400">{p.name}</h2>
            <p className="text-xl font-semibold mb-2 text-green-400">
              ₹{p.price}
            </p>
            <p className="text-gray-300 mb-2">{p.description}</p>
            <p className="text-gray-400 mb-4">{p.category}</p>

            <img
              src={p.image}
              alt={p.name}
              className="w-60 h-40 object-cover rounded-lg shadow"
            />
          </div>
        ))}
      </div>

      {/* ONLY CLEAR BUTTON (Compare Removed) */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            clearCompare();
            setTimeout(() => nav("/"), 10);
          }}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow text-lg"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
