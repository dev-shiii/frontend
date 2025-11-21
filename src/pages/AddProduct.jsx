import { useState } from "react";
import api from "../services/api";
import ThreeWavyBackground from "../components/ThreeWavyBackground";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    alert("Product Added!");
    setForm({ name: "", price: "", description: "", image: "" });
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center px-6 py-10">

      {/* ⭐ Animated Background */}
      <ThreeWavyBackground />

      <div
        className="
          bg-white/10 
          backdrop-blur-xl 
          border border-white/20 
          p-10 
          rounded-2xl 
          shadow-2xl 
          w-full 
          max-w-lg 
          text-white 
          z-10
        "
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-300 drop-shadow">
          Add New Product
        </h2>

        <form onSubmit={submitProduct} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="
                w-full p-3 
                bg-white/10 
                border border-white/20 
                rounded-lg 
                text-white 
                placeholder-gray-300 
                focus:ring-2 focus:ring-blue-400 
                outline-none
              "
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="
                w-full p-3 
                bg-white/10 
                border border-white/20 
                rounded-lg 
                text-white 
                placeholder-gray-300 
                focus:ring-2 focus:ring-blue-400 
                outline-none
              "
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="
                w-full p-3 
                bg-white/10 
                border border-white/20 
                rounded-lg 
                text-white 
                placeholder-gray-300 
                focus:ring-2 focus:ring-blue-400 
                outline-none
                min-h-[120px]
              "
              required
            ></textarea>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm mb-1">Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="
                w-full p-3 
                bg-white/10 
                border border-white/20 
                rounded-lg 
                text-white 
                placeholder-gray-300 
                focus:ring-2 focus:ring-blue-400 
                outline-none
              "
              required
            />
          </div>

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
              text-lg 
              transition 
              active:scale-95
            "
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
