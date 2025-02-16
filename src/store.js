import { create } from "zustand";

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null, // Ladda användardata från localStorage
  accessToken: localStorage.getItem("accessToken") || null, // Ladda accessToken från localStorage
  isAuthenticated: false,
  venueManager: false, // Byt namn från venueManager till venueManager

  // Login-funktion för att spara både användardata och accessToken
  login: (userData, accessToken, venueManager) => {
    const updatedUser = {
      ...userData,
      venueManager: venueManager ?? false // Om venueManager inte finns, sätt det till false
    };

    localStorage.setItem("user", JSON.stringify(updatedUser)); // Spara användardata
    localStorage.setItem("accessToken", accessToken); // Spara accessToken

    set({
      user: updatedUser,
      accessToken: accessToken,
      isAuthenticated: true,
      venueManager: updatedUser.venueManager, // Sätt venueManager i store
    });
  },

  // Logout-funktion för att ta bort användardata och accessToken
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("venueManager"); // Ta bort venueManager från localStorage

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      venueManager: false, // Återställ venueManager
    });
  },

  // Funktion för att sätta venueManager flagga
  setvenueManager: (venueManager) => {
    localStorage.setItem("venueManager", JSON.stringify(venueManager));
    set({ venueManager: !!venueManager });
  },
}));

export default useUserStore;
