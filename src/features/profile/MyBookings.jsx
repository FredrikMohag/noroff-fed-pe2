import React, { useEffect, useState } from "react";
import { fetchUserBookings } from "../../service/bookingService";
import useUserStore from "../../store";
import BookingCard from "../bookings/bookingCard";

const MyBookings = () => {
  const { user, accessToken } = useUserStore();
  const [bookings, setBookings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingsData = async () => {
      if (!user?.name || !accessToken) return;

      try {
        setLoading(true);
        const fetchedBookings = await fetchUserBookings(user.name, accessToken);

        if (Array.isArray(fetchedBookings)) {
          setBookings(fetchedBookings);
        } else if (fetchedBookings && Array.isArray(fetchedBookings.data)) {
          setBookings(fetchedBookings.data);
        } else {
          setBookings([]);
        }
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsData();
  }, [user, accessToken]);

  useEffect(() => {
    if (!bookings || !user?.email) return;

    const filteredBookings = bookings.filter((booking) => {
      return booking && booking.bookingId === user?.id;
    });

    setUserBookings(filteredBookings);
  }, [bookings, user]);

  return (
    <div className="profile-content">
      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p>{error}</p>
      ) : userBookings.length > 0 ? (
        <div className="bookings-container">
          {userBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
            />
          ))}
        </div>
      ) : (
        <p>No bookings yet.</p>
      )}
    </div>
  );
};

export default MyBookings;
