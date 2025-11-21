import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { isRegistered, isLoggedIn } = useContext(AuthContext);

  // Load cart when logged in
  const loadCart = async () => {
    if (!isRegistered || !isLoggedIn) {
      setCart([]);
      return;
    }

    try {
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch (err) {
      console.log("Cart Load Error:", err.response?.data);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isRegistered) {
      alert("You are not registered. Please register first.");
      return;
    }
    if (!isLoggedIn) {
      alert("Please log in to continue.");
      return;
    }

    try {
      const res = await api.post("/cart/add", { productId, quantity });
      setCart(res.data.items);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Please log in to continue.");
      } else {
        console.error("Add to cart error:", err.response?.data || err);
      }
    }
  };

  // Remove single item
  const removeFromCart = async (productId) => {
    if (!isRegistered) {
      alert("You are not registered. Please register first.");
      return;
    }
    if (!isLoggedIn) {
      alert("Please log in to continue.");
      return;
    }

    try {
      const res = await api.post("/cart/remove", { productId });
      setCart(res.data.items);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Please log in to continue.");
      } else {
        console.error("Remove cart error:", err.response?.data || err);
      }
    }
  };

  // ⭐ Clear all items from cart
  const clearCart = async () => {
    try {
      await api.post("/cart/clear"); // backend route to clear
      setCart([]); // update UI instantly
    } catch (err) {
      console.log("Clear cart error:", err.response?.data || err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        loadCart,
        clearCart, // ⭐ added export
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
