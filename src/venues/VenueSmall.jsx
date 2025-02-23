import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY, API_VENUES, BASE_API_URL } from "../constants"; // Importera rätt konstanter

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🔹 Fetching venues...");

    const fetchVenues = async () => {
      try {
        console.log("🔸 Sending request to API...");

        const response = await fetch(`${BASE_API_URL}${API_VENUES}`, {
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
          },
        });

        if (!response.ok) {
          console.error("❌ Response not ok, throwing error");
          throw new Error(`Failed to fetch venues: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("🎟️ Fetched venue data:", data);

        // Sortera baserat på 'created' (senaste först)
        const sortedVenues = data.data.sort((a, b) =>
          new Date(b.created) - new Date(a.created)
        );


        setVenues(sortedVenues);
      } catch (err) {
        console.error("❌ Error fetching venues:", err);
        setError(err.message);
      } finally {
        console.log("✅ Finished fetching venues.");
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Logging the current state values
  useEffect(() => {
    console.log("🔸 Loading state changed:", loading);
    console.log("🔸 Error state changed:", error);

  }, [loading, error, venues]);

  if (loading) {
    console.log("🔵 Loading venues...");  // Log for loading state
    return <div className="text-center mt-5">Loading...</div>;
  }
  if (error) {
    console.error("⚠️ Error encountered while loading venues:", error);  // Log for errors
    return <div className="text-danger text-center mt-5">Error: {error}</div>;
  }


  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">All Venues</h2>
      <div className="row">
        {venues.map((venue) => {
          const hasImage = venue.media?.[0]?.url;



          return (
            <div key={venue.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                {/* Bild */}
                <div
                  className="card-img-top"
                  style={{
                    height: "200px",
                    backgroundColor: hasImage ? "transparent" : "#ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                >
                  {!hasImage ? (
                    "No image available"
                  ) : (
                    <img
                      src={venue.media[0].url}
                      alt={venue.media[0]?.alt || "No image available"}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>

                <div className="card-body d-flex flex-column">
                  <div className="mb-3">
                    <p className="mb-1 text-muted">
                      {venue.location?.city || "Unknown City"}, {venue.location?.country || "Unknown Country"}
                    </p>
                    <h5 className="card-title">{venue.name}</h5>
                  </div>
                  <div className="mt-auto">
                    <p className="text-primary fw-bold">${venue.price} / night</p>
                    <button
                      className="btn btn-outline-primary w-100"
                      onClick={() => {
                        console.log(`🔘 Navigating to venue details for ${venue.name}`);
                        navigate(`/venues/${venue.id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Venues;
