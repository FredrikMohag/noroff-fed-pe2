import React, { useEffect, useState } from "react";
import { FaBed, FaCar, FaDog, FaDollarSign, FaLocationArrow, FaStar, FaUsers, FaWifi } from "react-icons/fa";
import { useParams } from "react-router-dom";
import BookingComponent from "../components/BookingComponent";
import { API_HOLIDAZE_URL } from "../constants";

const VenueFetch = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(`${API_HOLIDAZE_URL}/venues/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch venue details");
        }
        const data = await response.json();
        setVenue(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-danger text-center mt-5">Error: {error}</div>;
  if (!venue) return <div className="text-center mt-5">No details available</div>;

  const renderStars = (rating) => {
    const colors = ["#e74c3c", "#e67e22", "#f1c40f", "#f39c12", "#2ecc71"];
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} style={{ color: i < rating ? colors[i] : "#ccc", marginRight: "5px" }} />
    ));
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Bild över hela bredden */}
        <div className="col-md-12 text-center mb-4">
          <div style={{ width: "100%", maxHeight: "600px", backgroundColor: venue.media[0]?.url ? "transparent" : "#e0e0e0" }}>
            {venue.media[0]?.url ? (
              <img
                src={venue.media[0]?.url}
                className="img-fluid rounded"
                alt={venue.media[0]?.alt || "Venue"}
                style={{ maxHeight: "600px", objectFit: "cover", width: "100%" }}
              />
            ) : (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "600px", fontSize: "1.5rem", fontWeight: "bold", color: "#555" }}>
                No image available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Två kolumner: Beskrivning (8) | Bokning (4) */}
      <div className="row">
        {/* Vänster sektion (8 kolumner) */}
        <div className="col-md-8">
          {/* Stad och land */}
          <div className="d-flex align-items-center mb-3">
            <FaLocationArrow className="me-3" />
            <p className="mb-0">{venue.location.city}, {venue.location.country}</p>
          </div>

          {/* Namn och betyg */}
          <div className="d-flex align-items-center mb-4">
            <h1 className="mb-0 me-3">{venue.name}</h1>
            {renderStars(venue.rating)}
          </div>

          {/* Pris, gäster och faciliteter */}
          <div className="d-flex align-items-center mb-3">
            <FaDollarSign className="me-3" style={{ color: "#2ecc71" }} />
            <p className="mb-0">${venue.price} / night</p>
          </div>
          <div className="d-flex align-items-center mb-3">
            <FaUsers className="me-3" />
            <p className="mb-0">{venue.maxGuests} guests</p>
          </div>

          {/* Faciliteter */}
          {venue.meta.wifi && <div className="d-flex align-items-center mb-3"><FaWifi className="me-3" style={{ color: "#3498db" }} /><span>WiFi</span></div>}
          {venue.meta.parking && <div className="d-flex align-items-center mb-3"><FaCar className="me-3" style={{ color: "#2ecc71" }} /><span>Parking</span></div>}
          {venue.meta.breakfast && <div className="d-flex align-items-center mb-3"><FaBed className="me-3" style={{ color: "#f39c12" }} /><span>Breakfast</span></div>}
          {venue.meta.pets && <div className="d-flex align-items-center mb-3"><FaDog className="me-3" style={{ color: "#e74c3c" }} /><span>Pets Allowed</span></div>}

          {/* Beskrivning */}
          <div className="mb-4">
            <h3>Description</h3>
            <p>{venue.description}</p>
          </div>

          {/* Adressinformation */}
          <div className="mb-4">
            <h3>Location</h3>
            <p><strong>Address:</strong> {venue.location.address}</p>
            <p><strong>City:</strong> {venue.location.city}</p>
            <p><strong>Zip:</strong> {venue.location.zip}</p>
            <p><strong>Country:</strong> {venue.location.country}</p>
          </div>

          {/* Created and Updated */}
          <div className="mb-4">
            <h3>Dates</h3>
            <p><strong>Created:</strong> {new Date(venue.created).toLocaleDateString()}</p>
            <p><strong>Last Updated:</strong> {new Date(venue.updated).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Höger sektion (4 kolumner) - Bokningskomponent */}
        <div className="col-md-4">
          <BookingComponent venueId={venue.id} />
        </div>
      </div>
    </div>
  );
};

export default VenueFetch;
