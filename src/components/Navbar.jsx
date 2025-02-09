import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logotypen till vänster */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.svg" alt="Logo" className="logo" />
        </Link>
        {/* Navigationslänkar */}
        <ul className="navbar-list">

          <li><Link to="/login" className="navbar-link">Profile</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
