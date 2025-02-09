import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../auth/authSlice";
import Login from "./Login";
import Register from "./Register";

const AuthContainer = () => {
  const [showRegister, setShowRegister] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Om användaren redan är inloggad, navigera till profilsidan
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log("showRegister state:", showRegister);
  }, [showRegister]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/"); // Omdirigera till startsidan eller en annan sida
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
