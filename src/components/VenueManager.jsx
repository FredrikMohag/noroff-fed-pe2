import React from "react";
import useUserStore from "../store"; // Importera Zustand store

const VenueManager = ({ children }) => {
  const { user } = useUserStore(); // Hämta användaren från Zustand

  if (!user?.isVenueManager) {
    return null; // Döljer innehållet om användaren INTE är en venue manager
  }

  return <>{children}</>; // Visar innehållet om användaren ÄR en venue manager
};

export default VenueManager;
