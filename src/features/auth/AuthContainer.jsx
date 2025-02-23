import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store";
import Login from "./Login";
import Register from "./Register";

/**
 * AuthContainer component that handles user authentication (login/register).
 * If the user is already logged in, they are redirected to the profile page.
 * Displays either the login or register form depending on the user's choice.
 *
 * @returns {JSX.Element} The AuthContainer component.
 */
const AuthContainer = () => {
  const [showRegister, setShowRegister] = useState(false);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  /**
   * Effect hook to redirect the user to the profile page if they are logged in.
   * Runs whenever the user state changes.
   */
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  /**
   * Handles logging out the user by clearing their session and redirecting to the home page.
   */
  const handleLogout = () => {
    logout();
    navigate("/");
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
