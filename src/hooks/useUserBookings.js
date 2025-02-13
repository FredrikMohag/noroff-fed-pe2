import { useEffect, useState } from "react";
import { fetchBookings } from "../components/booking/bookingService";

const useUserBookings = (token, user, navigate) => {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      if (!user || !token) {
        console.log("Ingen användare eller token hittades. Avbryter...");
        setLoading(false);
        return;
      }

      try {
        console.log("Hämtar bokningar från API...");
        const bookings = await fetchBookings(token, { userId: user.id }); // Skicka relevant parameter här om det behövs

        console.log("📅 Bokningar hämtade:", bookings);
        setUserBookings(bookings);
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    getBookings(); // Kör funktionen här
  }, [user, token]); // Körs om user eller token ändras

  return { userBookings, loading };
};

export default useUserBookings;
