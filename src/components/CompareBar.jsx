import { useContext } from "react";
import { CompareContext } from "../context/CompareContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function CompareBar() {
  const { compareList, clearCompare } = useContext(CompareContext);
  const nav = useNavigate();
  const location = useLocation();

  // HIDE BAR ON COMPARE PAGE
  if (location.pathname === "/compare") return null;

  // Hide if no items selected
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
      <div className="bg-white shadow-xl rounded-xl px-6 py-4 flex items-center gap-6 border border-gray-300">

        <p className="text-gray-700 font-medium">
          {compareList.length} item selected
        </p>

        <button
          onClick={() => nav("/compare")}
          disabled={compareList.length < 2}
          className={`px-4 py-2 rounded-lg text-white shadow 
            ${compareList.length < 2 
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          Compare →
        </button>

        <button
          onClick={() => {
            clearCompare();
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
