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
import AdminPanel from "./pages/AdminPanel"
import Checkout from "./pages/Checkout";

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

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />

        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>

      {/* Floating Compare Bar (must be outside Routes) */}
      <CompareBar />
    </>
  );
}
