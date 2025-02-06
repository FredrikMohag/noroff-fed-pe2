import React from "react";
import { Link } from "react-router-dom";

function VenueDetails() {
  return (
    <div className="VenueDetails">
      <h1>VenueDetails</h1>
      <p>VenueDetails</p>
      <Link to="/" className="back-home">Go back to Home</Link>
    </div>
  );
}

export default VenueDetails;
