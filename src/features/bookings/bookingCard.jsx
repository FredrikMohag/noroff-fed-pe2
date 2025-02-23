import React from 'react';

const BookingCard = ({ booking }) => {

  if (!booking) {
    return <p>Error: Booking not found</p>;
  }

  const { dateFrom, dateTo, guests, id, customer, venue } = booking;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="booking-card">
      {/* Venue Image with Default Placeholder */}
      <div className="venue-image">
        {venue?.media?.[0]?.url ? (
          <img src={venue.media[0].url} alt={venue.media[0]?.alt || venue.name} />
        ) : (
          <div className="placeholder-image">No Image Available</div>
        )}
      </div>

      {/* Booking Dates */}
      <div className="booking-card-content">
        <div className="booking-dates">
          <div className="date-card">
            <p>{formatDate(dateFrom)}</p>
          </div>
          <span className="date-divider">-</span>
          <div className="date-card">
            <p>{formatDate(dateTo)}</p>
          </div>
        </div>

        {/* Customer & Venue Info */}
        <div className="booking-info">
          <div className="customer-info">
            <p><strong>Customer:</strong> {customer?.name}</p>
            <p><strong>Email:</strong> {customer?.email}</p>
          </div>
          <div className="venue-info">
            <p><strong>Venue:</strong> {venue?.name}</p>
            <p><strong>Location:</strong> {venue?.location?.address}, {venue?.location?.city}</p>
            <p><strong>Price:</strong> ${venue?.price}</p>
            <p><strong>Max Guests:</strong> {venue?.maxGuests}</p>
            <p><strong>Guests:</strong> {guests}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
