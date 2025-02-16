import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AuthContainer from "../features/auth/AuthContainer";
import ProfileDetails from "../features/profile/ProfileDetails";
import useUserStore from "../store"; // ✅ Importera Zustand store

function Auth() {
  const user = useUserStore((state) => state.user); // ✅ Hämta användaren
  const navigate = useNavigate();

  // ✅ Om användaren redan är inloggad, skicka till "/profile"
  React.useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true }); // replace: true hindrar att back-knappen går tillbaka hit
    }
  }, [user]);

  return (
    <Layout>
      <div className="background-image" />
      {user ? <ProfileDetails /> : <AuthContainer />}
    </Layout>
  );
}

export default Auth;
