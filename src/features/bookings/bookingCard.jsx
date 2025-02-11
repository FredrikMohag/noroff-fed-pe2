import React from 'react';

const BookingCard = ({ booking }) => {
  // Kolla så att vi faktiskt får en bokning
  if (!booking || !booking.venue) {
    return <p>Booking details missing</p>;
  }

  // Logga ut bokningsinformation för att felsöka
  console.log('Booking:', booking);

  // Här använder vi informationen från booking-objektet
  return (
    <div className="booking-card">
      <img src={booking.venue.image || 'default-image.jpg'} alt={booking.venue.name} />
      <h3>{booking.venue.name}</h3>
      <p><strong>From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
      <p><strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
      <p><strong>Guests:</strong> {booking.guests}</p>

      {/* Knapp för att gå till detaljer */}
      <button onClick={() => {/* Logik för att navigera till venue details */ }}>View Details</button>
      {/* Knapp för att ta bort bokning */}
      <button onClick={() => {/* Logik för att ta bort bokning */ }}>Delete</button>
    </div>
  );
};

export default BookingCard;
