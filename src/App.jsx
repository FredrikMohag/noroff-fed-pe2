import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute"; // Importera PrivateRoute för att skydda rutter
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import VenueDetails from "./pages/Venue";
import useUserStore from "./store"; // Hämta Zustand-store
import Venues from "./venues/VenueCard";

function App() {
  const user = useUserStore((state) => state.user);
  console.log("🔹 User 123 data from Zustand:", user);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />

      {/* Skydda /profile med PrivateRoute */}
      <Route
        path="/profile"
        element={
          <PrivateRoute isAuthenticated={!!user}>
            <Profile />
          </PrivateRoute>
        }
      />


      <Route path="/venues" element={<Venues />} />
      <Route path="/venues/:id" element={<VenueDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
