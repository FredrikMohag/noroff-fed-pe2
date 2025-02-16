import React from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store"; // Importera Zustand store

const LogoutButton = () => {
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Rensar Zustand
    navigate("/login"); // Skicka användaren till login-sidan
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
