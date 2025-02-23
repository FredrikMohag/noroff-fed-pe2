import React, { useEffect, useState } from "react";
import { fetchVenues } from "../../service/venueService";
import useUserStore from "../../store";
import VenueCard from "../../venues/VenueCard";

const MyVenues = () => {
  const { user, accessToken, isVenueManager } = useUserStore();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVenuesData = async () => {
    if (!user?.name || !accessToken || !isVenueManager) {
      setError("Missing user data or insufficient permissions.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedVenues = await fetchVenues(user.name, accessToken);
      if (fetchedVenues && Array.isArray(fetchedVenues.data)) {
        setVenues(fetchedVenues.data);
      } else {
        setError("Unexpected data format for venues.");
      }
    } catch (err) {
      setError("Failed to load venues. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenuesData();
  }, [user, accessToken, isVenueManager]);

  return (
    <div className="profile-content">
      {loading ? (
        <p>Loading venues...</p>
      ) : error ? (
        <p>{error}</p>
      ) : venues.length > 0 ? (
        <div className="venues-list">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <p>No venues yet.</p>
      )}
    </div>
  );
};

export default MyVenues;
