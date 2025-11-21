import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // boolean helpers
  const isLoggedIn = !!user;
  // If you track registration separately, change this logic.
  // For now 'isRegistered' is true when user exists.
  const isRegistered = !!user;

  // Register user
  // Returns the created user data (or throws an axios error)
  const registerUser = async (name, email, password) => {
    // Basic client-side validation (optional but handy)
    if (!name || !email || !password) {
      throw { message: "All fields are required" };
    }

    // Note: baseURL already points to .../api, so we call /auth/register
    const res = await api.post("/auth/register", { name, email, password });
    // The backend returns { message, user } per our controller
    return res.data;
  };

  // Login user
  const loginUser = async (email, password) => {
    if (!email || !password) {
      throw { message: "Email and password are required" };
    }

    const res = await api.post("/auth/login", { email, password });
    const { token, user: userData } = res.data;

    // store token for future requests
    localStorage.setItem("token", token);

    // set user in state
    setUser(userData);

    return res.data;
  };

  // Load user if token exists
  const loadUser = async () => {
    setLoadingAuth(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoadingAuth(false);
      return;
    }

    try {
      // this will use the interceptor to attach the token (not blocked by our auth-route guard)
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.warn("Failed to load user:", err.response?.data || err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  // Logout
  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isRegistered,
        loadingAuth,
        registerUser,
        loginUser,
        loadUser,
        logoutUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
