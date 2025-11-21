import { createContext, useState, useEffect } from "react";

export const CompareContext = createContext();

export default function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  // Load saved items from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("compare")) || [];
    setCompareList(saved);
  }, []);

  // Save to localStorage whenever compareList changes
  useEffect(() => {
    localStorage.setItem("compare", JSON.stringify(compareList));
  }, [compareList]);


  // Add a product
  const addToCompare = (product) => {
    if (compareList.length >= 2) {
      alert("You can compare only two products!");
      return;
    }

    if (compareList.some((p) => p._id === product._id)) {
      return; // already added
    }

    setCompareList([...compareList, product]);
  };

  // Remove product
  const removeFromCompare = (id) => {
    setCompareList(compareList.filter((p) => p._id !== id));
  };

  // Clear all
  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}
