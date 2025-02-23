import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import VenueDetails from "./pages/Venue";
import useUserStore from "./store";
import Venues from "./venues/VenueSmall";


function App() {
  const user = useUserStore((state) => state.user);
  const bookings = useUserStore((state) => state.bookings);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" />}
      />
      <Route path="/venues" element={<Venues />} />
      <Route path="/venues/:id" element={<VenueDetails />} />
    </Routes>
  );
}

export default App;
