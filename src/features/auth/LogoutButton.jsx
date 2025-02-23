import React from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store";

const LogoutButton = () => {
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
