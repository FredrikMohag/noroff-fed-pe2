import React from "react";
import useUserStore from "../store"; // Importera Zustand store

const VenueManager = ({ children }) => {
  const user = useUserStore((state) => state.user); // Hämta användaren från Zustand

  if (!user?.venueManager) {
    return null; // Döljer innehållet om användaren INTE är en venue manager
  }

  return <>{children}</>; // Visar innehållet om användaren ÄR en venue manager
};

export default VenueManager;
