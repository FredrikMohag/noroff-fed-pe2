import React from "react";

const BookingCard = ({ booking }) => {
  if (!booking) {
    return <p>Booking details missing</p>;
  }

  console.log("🎟️ Rendering BookingCard med data:", booking);

  return (
    <div className="booking-card">
      <h3>{booking.venue?.name || "Unknown Venue"}</h3>
      <img src={booking.venue?.image || "default-image.jpg"} alt={booking.venue?.name || "Venue Image"} />
      <p><strong>From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
      <p><strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
      <p><strong>Guests:</strong> {booking.guests}</p>

      <button onClick={() => {/* Logik för att navigera till venue details */ }}>View Details</button>
      <button onClick={() => {/* Logik för att ta bort bokning */ }}>Delete</button>
    </div>
  );
};

export default BookingCard;
