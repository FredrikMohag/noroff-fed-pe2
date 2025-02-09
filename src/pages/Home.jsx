import React from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import Venues from "../venues/VenueCard.jsx";

const Home = () => {
  return (
    <Layout>
      <div className="background-image" />
      <SearchBar />
      <Venues />
    </Layout>
  );
};

export default Home;
