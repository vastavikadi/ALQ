import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/router";
import MusicPlayer from "@/components/MusicPlayer";


export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", formData);
      setMessage("Signup successful! Redirecting...");
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md scale-110"
        style={{ backgroundImage: "url('/assets/images/background-image.png')" }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <MusicPlayer />
      
      {/* Toast message */}
      {message && (
        <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-md z-50">
          {message}
        </div>
      )}

      {/* Signup Form */}
      <div className="relative z-10 bg-black bg-opacity-70 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          🧙‍♂️ Sign Up for AlgoQuest
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-1">Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Create a strong password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
