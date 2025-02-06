import React from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import Venues from "../venues/VenueList.jsx";

const Home = () => {
  return (
    <Layout>
      <SearchBar />
      <Venues />
    </Layout>
  );
};

export default Home;
