import { create } from "zustand";

const useUserStore = create((set) => {
  // Ladda användardata och accessToken från localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedAccessToken = localStorage.getItem("accessToken");

  // Ladda bokningar från localStorage om de finns
  const storedBookings = JSON.parse(localStorage.getItem("userBookings")) || [];

  return {
    user: storedUser || null,
    accessToken: storedAccessToken || null,
    isAuthenticated: !!storedUser && !!storedAccessToken,
    venueManager: storedUser?.venueManager || false, // Hämta från user-objektet
    userBookings: storedBookings, // Hämta bokningar från localStorage

    // Funktion för att lägga till en bokning i state och localStorage
    addBooking: (booking) => {
      set((state) => {
        const newBookings = [...state.userBookings, booking];
        localStorage.setItem("userBookings", JSON.stringify(newBookings)); // Uppdatera bokningar i localStorage
        return { userBookings: newBookings };
      });
    },

    // Login-funktion
    login: (userData, accessToken) => {
      const updatedUser = { ...userData, venueManager: userData.venueManager ?? false };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("accessToken", accessToken);

      const storedBookings = JSON.parse(localStorage.getItem("userBookings")) || []; // Hämta bokningar från localStorage
      set({
        user: updatedUser,
        accessToken,
        isAuthenticated: true,
        venueManager: updatedUser.venueManager,
        userBookings: storedBookings, // Sätt de lagrade bokningarna i tillståndet
      });
    },

    // Logout-funktion
    logout: () => {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userBookings"); // Ta bort bokningar från localStorage vid logout

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        venueManager: false,
        userBookings: [], // Töm bokningar vid logout
      });
    },

    // Uppdatera venueManager
    setVenueManager: (venueManager) => {
      set((state) => {
        const updatedUser = { ...state.user, venueManager };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Uppdatera hela user-objektet i localStorage

        return { user: updatedUser, venueManager };
      });
    },
  };
});

export default useUserStore;
