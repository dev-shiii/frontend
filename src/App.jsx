import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProduct from "./pages/AddProduct";
import OrderPage from "./pages/OrderPage";
import Compare from "./pages/Compare";
import CompareBar from "./components/CompareBar";
import AdminPanel from "./pages/AdminPanel";
import Checkout from "./pages/Checkout";

// ⭐ Stripe Pages
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

// ⭐ NEW — Nearby Products Map Page
import NearbyProductsMap from "./pages/NearbyProductsMap";

import "./index.css";

export default function App() {
  return (
    <>
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/order/:id/pay" element={<OrderPage />} />
        <Route path="/order/:id" element={<OrderDetails />} />

        {/* Stripe Payment Routes */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/add-product" element={<AddProduct />} />

        {/* Compare */}
        <Route path="/compare" element={<Compare />} />

        {/* ⭐ NEW — Nearby Products Route */}
        <Route path="/nearby" element={<NearbyProductsMap />} />
      </Routes>

      {/* Floating Compare Bar */}
      <CompareBar />
    </>
  );
}
