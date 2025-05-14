import MusicPlayer from "@/components/MusicPlayer";
import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false); // NEW
  const [message, setMessage] = useState(""); // for toast
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      const { token, user } = res.data;
      login(user, token, rememberMe); // ✅ pass rememberMe
      setMessage("Login successful!");
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with heavy blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md scale-110"
        style={{ backgroundImage: "url('/assets/images/background-image.png')" }}
      ></div>

      <MusicPlayer />

      {/* Dark overlay to enhance contrast */}
      <div className="absolute inset-0 bg-black opacity-75"></div>

      {/* Toast */}
      {message && (
        <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg shadow-md z-50">
          {message}
        </div>
      )}

      {/* Login Form */}
      <div className="relative z-10 bg-black bg-opacity-70 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          🔐 Login to AlgoQuest
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
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
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your password"
            />
          </div>

          {/* ✅ Remember Me checkbox */}
          <div className="flex items-center justify-between text-gray-300">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="form-checkbox h-4 w-4 text-purple-600"
              />
              <span className="text-sm">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
