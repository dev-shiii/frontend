import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import CompareProvider from "./context/CompareContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <CompareProvider>
          <App />
        </CompareProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
