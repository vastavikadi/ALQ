import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: false, // true if you use cookie-based auth
});

// Request interceptor: Attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token expiry or 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn("Token expired or unauthorized. Redirecting...");

      // Clear saved auth info
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect user to login or landing page
      window.location.href = "/login"; // or use "/login" if needed
    }

    return Promise.reject(error);
  }
);

export default api;
