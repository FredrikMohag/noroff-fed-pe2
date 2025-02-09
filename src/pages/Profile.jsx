// src/pages/Profile.jsx
import React from "react";
import Layout from "../components/Layout";
import ProfileDetails from "../features/profile/ProfileDetails";

function Profile() {
  return (
    <Layout>

      <div className="background-image" />
      <ProfileDetails />

    </Layout>
  );
}

export default Profile;
