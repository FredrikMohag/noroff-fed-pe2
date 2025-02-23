import React, { useEffect, useState } from "react";
import useUserStore from "../store";

const VenueManager = ({ children }) => {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user?.isVenueManager) {
    return null;
  }

  return <>{children}</>;
};

export default VenueManager;
