import { useEffect, useState } from "react";
import { fetchUserBookings } from "../service/bookingService";
import useUserStore from "../store";

/**
 * Custom hook to manage user bookings.
 * It fetches the user's bookings from the API and stores them in the Zustand store.
 *
 * @returns {Object} An object containing the user's bookings and the loading state.
 * @returns {Array} bookings - The list of bookings for the user.
 * @returns {boolean} loading - A flag indicating whether the bookings are still being fetched.
 */
const useUserBookings = () => {
  const { user, accessToken, setBookings, bookings } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email || !accessToken) {
      setLoading(false);
      return;
    }

    /**
     * Fetch the user's bookings from the API and update the Zustand store.
     *
     * @returns {Promise<void>} Resolves when the bookings have been fetched and stored.
     */
    const getBookings = async () => {
      try {
        const fetchedBookings = await fetchUserBookings(user.email, accessToken);
        const validBookings = Array.isArray(fetchedBookings) ? fetchedBookings : [];

        if (!Array.isArray(fetchedBookings)) {
          setBookings(validBookings);
        }
      } catch (error) {
        console.error("❌ Error fetching bookings:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, [user, accessToken]);

  return { bookings, loading };
};

export default useUserBookings;
