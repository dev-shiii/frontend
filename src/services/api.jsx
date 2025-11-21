import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🚫 Do NOT attach token when calling /auth/register or /auth/login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isAuthRoute =
    config.url.includes("/auth/register") ||
    config.url.includes("/auth/login");

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
