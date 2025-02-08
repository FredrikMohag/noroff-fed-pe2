import React from "react";
import Layout from "../components/Layout";
import VenueFetch from "../venues/VenueDetails";
function VenueDetails() {
  return (
    <Layout>
      <div className="VenueDetails">
        <VenueFetch /> {/* Rendera den separata komponenten */}
      </div>
    </Layout>
  );
}

export default VenueDetails;
