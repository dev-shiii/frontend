import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ThreeWavyBackground from "../components/ThreeWavyBackground";

export default function Register() {
  const { registerUser } = useContext(AuthContext);
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
        console.log("FORM DATA:", form);  // 🔥 ADD THIS
      await registerUser(form.name, form.email, form.password);

      alert("User registered successfully! Please log in.");
      nav("/login");
    } catch (err) {
      console.error("Register failed", err.response?.data || err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen px-4">

      {/* ⭐ Three.js Background */}
      <ThreeWavyBackground />

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          bg-white/10 
          backdrop-blur-lg
          border border-white/20
          shadow-xl 
          rounded-2xl 
          p-8 
          w-full 
          max-w-md 
          text-white
          z-10
        "
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-300 drop-shadow">
          Create Account
        </h2>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="
            w-full p-3 mb-4 
            bg-white/10 
            text-white 
            border border-white/20 
            rounded-lg 
            placeholder-gray-300 
            focus:ring-2 focus:ring-blue-400
            outline-none
          "
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="
            w-full p-3 mb-4 
            bg-white/10 
            text-white 
            border border-white/20 
            rounded-lg 
            placeholder-gray-300 
            focus:ring-2 focus:ring-blue-400
            outline-none
          "
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="
            w-full p-3 mb-6 
            bg-white/10 
            text-white 
            border border-white/20 
            rounded-lg 
            placeholder-gray-300 
            focus:ring-2 focus:ring-blue-400
            outline-none
          "
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full 
            bg-blue-600 
            hover:bg-blue-700 
            text-white 
            py-3 
            rounded-lg 
            shadow 
            transition 
            active:scale-95
          "
        >
          Register
        </button>
      </motion.form>
    </div>
  );
}
