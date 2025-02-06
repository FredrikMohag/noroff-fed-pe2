import React from "react";
import '../styles/global.scss';
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />

      {/* Bakgrundsbild */}
      <div className="background-image" />

      <main className="content">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
