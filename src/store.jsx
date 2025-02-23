import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => {
      const storedUser = localStorage.getItem("user");
      const storedAvatar = localStorage.getItem("avatar");

      const defaultAvatar = { url: "default_avatar_url", alt: "Default Avatar" };
      const avatar = storedAvatar ? JSON.parse(storedAvatar) : defaultAvatar;
      const user = storedUser ? { ...JSON.parse(storedUser), avatar } : null;

      return {
        user,
        accessToken: null,
        isAuthenticated: !!user,
        isVenueManager: false,
        profileData: user,
        avatar,
        bookings: [],
        venues: [],

        setAvatar: (newAvatar) => {
          set((state) => ({
            user: state.user ? { ...state.user, avatar: newAvatar } : null,
            avatar: newAvatar,
          }));

          localStorage.setItem("avatar", JSON.stringify(newAvatar));
        },

        setBookings: (newBookings) => {
          localStorage.setItem("userBookings", JSON.stringify(newBookings));
          set({ bookings: newBookings });
        },

        addBooking: (newBooking) => {
          set((state) => {
            const updatedBookings = [...state.bookings, newBooking];
            localStorage.setItem("userBookings", JSON.stringify(updatedBookings));
            return { bookings: updatedBookings };
          });
        },

        setVenues: (venues) => {
          localStorage.setItem("userVenues", JSON.stringify(venues));
          set({ venues: Array.isArray(venues) ? venues : [] });
        },

        addVenue: (newVenue) => {
          const { user } = get();
          if (!user || !user.email) {
            return;
          }

          const venueWithOwner = {
            ...newVenue,
            owner: { email: user.email },
          };

          set((state) => {
            const updatedVenues = [...state.venues, venueWithOwner];
            localStorage.setItem("userVenues", JSON.stringify(updatedVenues));
            return { venues: updatedVenues };
          });
        },

        removeBooking: (bookingId) => {
          set((state) => {
            const updatedBookings = state.bookings.filter((b) => b.id !== bookingId);
            localStorage.setItem("userBookings", JSON.stringify(updatedBookings));
            return { bookings: updatedBookings };
          });
        },

        login: (userData, accessToken, isVenueManager, avatarUrl) => {
          const userAvatar = avatarUrl
            ? { url: avatarUrl, alt: "User Avatar" }
            : { url: "https://default_avatar_url", alt: "Default Avatar" };

          const userWithAvatar = { ...userData, avatar: userAvatar };

          set({
            user: userWithAvatar,
            accessToken,
            isAuthenticated: true,
            isVenueManager,
            profileData: userWithAvatar,
            venues: JSON.parse(localStorage.getItem("userVenues")) || [],
            avatar: userAvatar,
          });

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("avatar", JSON.stringify(userAvatar));
          localStorage.setItem("user", JSON.stringify(userWithAvatar));
        },

        logout: () => {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isVenueManager: false,
            profileData: null,
            avatar: null,
            bookings: [],
            venues: [],
          });

          localStorage.removeItem("userVenues");
          localStorage.removeItem("userBookings");
          localStorage.removeItem("avatar");
          localStorage.removeItem("user");
        },
      };
    },
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore;
