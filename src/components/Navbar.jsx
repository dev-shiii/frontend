import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext); // FIXED

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="
        bg-[#0d0d0d] 
        border-b border-white/10 
        shadow-xl 
        sticky 
        top-0 
        z-50 
        w-full
      "
    >
      <div
        className="
          max-w-7xl 
          mx-auto 
          flex 
          items-center 
          justify-between 
          px-6 
          py-4
        "
      >

        <Link
          to="/"
          className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition"
        >
          ShopEasy
        </Link>

        <div className="flex gap-8 text-gray-300 font-medium">

          <Link className="hover:text-white transition" to="/">
            Home
          </Link>

          <Link className="hover:text-white transition" to="/cart">
            Cart
          </Link>

          <Link className="hover:text-white transition" to="/orders">
            Orders
          </Link>

          {user?.role === "admin" && (
            <Link className="hover:text-white transition" to="/add-product">
              Add Product
            </Link>
          )}
        </div>

        <div className="flex gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="
                  px-4 py-2 
                  border border-blue-400 
                  text-blue-300 
                  rounded-lg 
                  hover:bg-blue-600/20 
                  transition
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  px-4 py-2 
                  bg-blue-600 
                  hover:bg-blue-700 
                  text-white 
                  rounded-lg 
                  shadow 
                  transition
                "
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={logoutUser}    // FIXED
              className="
                px-4 py-2 
                bg-red-600 
                hover:bg-red-700 
                text-white 
                rounded-lg 
                shadow 
                transition
              "
            >
              Logout ({user.role})
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
