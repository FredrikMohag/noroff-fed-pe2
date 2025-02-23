import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteVenueModal from "../features/profile/DeleteVenueModal";
import { fetchBookingsForVenue } from "../service/bookingService"; // Importera funktionen för att hämta bokningar
import { deleteVenue } from "../service/venueService"; // Importera deleteVenue från tjänsten

const VenueCard = ({ venue, accessToken, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    // Hämta bokningar för venue
    const fetchBookings = async () => {
      try {
        const count = await fetchBookingsForVenue(venue.id, accessToken); // Hämta antalet bokningar
        setBookingsCount(count);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [venue.id, accessToken]); // Effektens beroenden: när venue.id eller accessToken ändras

  if (!venue) {
    console.error("❌ Venue is missing!");
    return <p>Error: Venue not found</p>;
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true); // Visa modalen när Delete knappen trycks
  };

  const handleCancel = () => {
    setShowDeleteModal(false); // Stäng modalen när användaren klickar på Avbryt
  };

  const handleDelete = async (venueId) => {
    try {
      const success = await deleteVenue(venueId); // Anropa deleteVenue från venueService
      if (success) {
        setShowDeleteModal(false); // Stäng modalen om borttagning lyckades
        onDelete(venueId); // Uppdatera föräldern (om du behöver det, t.ex. för att ta bort venue från listan)
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
    }
  };

  return (
    <div className="venue-card">
      <div className="venue-image">
        {venue.media && venue.media.length > 0 ? (
          <img src={venue.media[0].url} alt={venue.media[0].alt || venue.name} />
        ) : (
          <div className="placeholder-image">No Image Available</div>
        )}
      </div>

      <div className="venue-card-content">
        {/* Venue name added here */}
        <h3>{venue.name}</h3>

        <div className="actions">
          <Link to={`/venues/${venue.id}`} className="view-details">
            View details
          </Link>
        </div>

        <div className="booking-status">
          {/* Booked status and number of bookings */}
          <p><strong>Booked:</strong> {bookingsCount} times</p>
        </div>

        <div className="actions-bottom">
          {/* Update Venue Link */}
          <Link to={`/venues/edit/${venue.id}`} className="update-venue button">
            Update Venue
          </Link>
          <button onClick={handleDeleteClick} className="delete-venue button">
            Delete Venue
          </button>
        </div>
      </div>

      {/* Visa DeleteModal om showDeleteModal är true */}
      {showDeleteModal && (
        <DeleteVenueModal
          venueId={venue.id}
          onDelete={handleDelete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default VenueCard;
