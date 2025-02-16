import axios from "axios"; // Se till att axios är importerad
import { useEffect, useState } from "react";
import { API_KEY } from "../constants"; // Importera din API-nyckel från constants
import useUserStore from "../store"; // Zustand store

const useUserBookings = () => {
  const { user, accessToken } = useUserStore(); // Hämta användardata och accessToken från Zustand
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.name || !accessToken) {
      console.log("Ingen användare eller accessToken hittades. Avbryter...");
      setLoading(false);
      return;
    }

    // Funktion för att hämta bokningar
    const getBookings = async () => {
      try {
        // Gör förfrågan med både Authorization header och API-nyckel
        const response = await axios.get(`https://v2.api.noroff.dev/holidaze/bookings?user=${user.name}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY, // Lägg till API-nyckeln här
          }
        });

        const bookings = response.data.data || []; // Hämta rätt data och fallback till tom array
        console.log("Bookings data:", bookings); // Logga bokningsdata för att se strukturen

        // Kontrollera om bokningarna är en array innan vi uppdaterar state
        if (Array.isArray(bookings)) {
          setUserBookings(bookings); // Uppdatera state med de hämtade bokningarna
        } else {
          console.warn("Bookings är inte en array:", bookings);
        }

      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false); // Sätt loading till false när hämtningen är klar
      }
    };

    getBookings(); // Hämta bokningar när användare och accessToken är tillgängliga
  }, [user, accessToken]); // Kör effekten när user eller accessToken ändras

  return { userBookings, loading }; // Returnera userBookings och loading state
};

export default useUserBookings;
