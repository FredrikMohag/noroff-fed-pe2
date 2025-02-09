import React from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import AuthContainer from "../features/auth/AuthContainer";
import ProfileDetails from "../features/profile/ProfileDetails";


function Auth() {
  // Hämta autentiseringsstatus från Redux store
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Layout>

      <div className="background-image" />
      {isAuthenticated ? <ProfileDetails /> : <AuthContainer />}

    </Layout>
  );
}

export default Auth;
