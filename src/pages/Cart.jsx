import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import ThreeWavyBackground from "../components/ThreeWavyBackground";

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const nav = useNavigate();

  const goToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    nav("/checkout");
  };

  return (
    <div className="relative min-h-screen p-6">
      <ThreeWavyBackground />

      <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-300 text-lg drop-shadow-lg">Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.productId._id}
              className="
                bg-white/10
                backdrop-blur-md
                border border-white/20
                rounded-xl
                p-4
                mb-4
                shadow-lg
                text-white
                max-w-xl
              "
            >
              <h3 className="text-lg font-semibold">{item.productId.name}</h3>

              <p className="text-gray-200">Price: ₹{item.productId.price}</p>
              <p className="text-gray-200">Quantity: {item.quantity}</p>

              <button
                onClick={() => removeFromCart(item.productId._id)}
                className="
                  mt-4
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  transition
                  shadow
                "
              >
                Remove
              </button>
            </div>
          ))}

          <div
            className="
              bg-white/10
              backdrop-blur-md
              border border-white/20
              rounded-xl
              p-4
              text-white
              max-w-xl
              mt-8
            "
          >
            <div className="flex gap-4">
              <button
                onClick={goToCheckout}
                className="
                  w-full 
                  bg-green-600 
                  hover:bg-green-700 
                  text-white 
                  py-3 
                  text-lg 
                  rounded-lg 
                  shadow 
                  transition 
                  active:scale-95
                "
              >
                Place Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
