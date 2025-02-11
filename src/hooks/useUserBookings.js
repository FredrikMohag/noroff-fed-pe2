import { useEffect, useState } from "react";
import { fetchBookings } from "../components/booking/bookingService";

const useUserBookings = (token, user, navigate) => {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/profile");
    } else if (token) {
      fetchBookings(token, { _customer: true })
        .then((response) => {
          // Om response har en "data"-egenskap används den, annars antar vi att response är själva arrayen
          const allBookings = response.data || response;

          // 🔥 Filtrera bort bokningar som inte tillhör den inloggade användaren
          const currentUserBookings = allBookings.filter(
            (booking) => booking.customer.email === user.email
          );

          console.log("Filtrerade bokningar för current user:", currentUserBookings);
          setUserBookings(currentUserBookings);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching bookings:", error);
          setLoading(false);
        });
    }
  }, [user, token, navigate]);


  return { userBookings, loading };

};

export default useUserBookings;
