import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Navbar() {
  const user = useSelector((state) => state.auth.user); // Kolla om användaren är inloggad

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logotypen till vänster */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.svg" alt="Logo" className="logo" />
        </Link>

        {/* Navigationslänkar */}
        <ul className="navbar-list">
          {user ? (
            <li>
              <Link to="/profile" className="navbar-link">Profile</Link>
            </li>
          ) : (
            <li>
              <Link to="/login" className="navbar-link">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
