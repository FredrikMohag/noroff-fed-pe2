import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AuthContainer from "../features/auth/AuthContainer";
import ProfileDetails from "../features/profile/ProfileDetails";
import useUserStore from "../store";

function Auth() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/profile", { replace: true });
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
