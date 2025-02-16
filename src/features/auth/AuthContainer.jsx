import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store"; // ✅ Importera Zustand store
import Login from "./Login";
import Register from "./Register";

const AuthContainer = () => {
  const [showRegister, setShowRegister] = useState(false);
  const user = useUserStore((state) => state.user); // ✅ Hämta användaren
  const logout = useUserStore((state) => state.logout); // ✅ Hämta logout-funktion
  const navigate = useNavigate();

  // ✅ Om användaren redan är inloggad, skicka till "/profile"
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/"); // ✅ Omdirigera till startsidan
  };

  return (
    <div className="auth-background">
      <div className="auth-container">
        {showRegister ? <Register /> : <Login />}

        <p>
          {showRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            className="link"
            onClick={() => setShowRegister(!showRegister)}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            {showRegister ? "Log in here!" : "Register here!"}
          </span>
        </p>

        {/* Om användaren är inloggad, visa logout-knappen */}
        {user && (
          <button onClick={handleLogout} className="logout-btn">
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
