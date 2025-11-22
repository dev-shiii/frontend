import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ThreeWavyBackground from "../components/ThreeWavyBackground";

export default function PaymentSuccess() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <ThreeWavyBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-10 text-center text-white max-w-lg w-full z-10"
      >
        <h1 className="text-3xl font-bold text-green-300 drop-shadow mb-4">
          Payment Successful! 🎉
        </h1>

        <p className="text-gray-300 mb-6">
          Your payment was completed successfully.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/orders"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg"
          >
            View Orders
          </Link>

          <Link
            to="/"
            className="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg text-lg"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
