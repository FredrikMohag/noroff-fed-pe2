import axios from "axios";
import { useEffect, useState } from "react";
import { API_KEY } from "../constants";
import useUserStore from "../store";

const useUserBookings = () => {
  const { user, accessToken } = useUserStore();
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email || !accessToken) {
      console.log("❌ Ingen användare eller accessToken hittades. Avbryter...");
      setLoading(false);
      return;
    }

    const getBookings = async () => {
      try {
        const url = `https://v2.api.noroff.dev/holidaze/bookings?userEmail=${user.email}`;
        console.log("🔎 Fetching bookings from:", url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY,
          },
        });

        const bookings = response.data.data || [];
        console.log("✅ Hämtade bokningar:", bookings);

        if (Array.isArray(bookings)) {
          setUserBookings(bookings);
        } else {
          console.warn("⚠️ Bookings är inte en array:", bookings);
        }
      } catch (error) {
        console.error("❌ Error fetching bookings:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    getBookings();
  }, [user, accessToken]);


  return { userBookings, loading };
};

export default useUserBookings;
