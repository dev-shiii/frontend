import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function useRequireAuth() {
  const { isRegistered, isLoggedIn } = useContext(AuthContext);
  const nav = useNavigate();

  const check = (action = "continue") => {

    // 🔥 FIX: these are booleans, NOT functions
    if (!isRegistered) {
      alert("You are not registered. Please register first.");
      nav("/register");
      return false;
    }

    if (!isLoggedIn) {
      alert("Please log in to " + action);
      nav("/login");
      return false;
    }

    return true;
  };

  return { check };
}
