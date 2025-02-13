import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useUserBookings from "../../hooks/useUserBookings";
import { logoutUser } from "../auth/authSlice";
import BookingCard from "../bookings/BookingCard";
import { getAvatar, setAvatar } from "./avatarService";
import CreateVenueForm from "./CreateVenueForm";

const ProfileDetails = () => {
  console.log("🔵 ProfileDetails komponenten renderas...");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = user?.accessToken;

  console.log("🔹 Användarinfo:", user);
  console.log("🔹 Token:", token);

  const [avatar, setAvatarState] = useState(getAvatar() || user?.avatar || null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [showCreateVenue, setShowCreateVenue] = useState(false);

  console.log("📌 Aktiv flik:", activeTab);
  console.log("🏨 Show Create Venue Modal:", showCreateVenue);

  // Använd useUserBookings hook för att hämta bokningar
  const { userBookings, loading } = useUserBookings(token, user, navigate);

  console.log("📅 Användarens bokningar:", userBookings);
  console.log("⏳ Laddar bokningar:", loading);

  const handleAvatarUpload = (event) => {
    console.log("📸 Ny avatar laddas upp...");
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarUrl = reader.result;
        setAvatarState(avatarUrl);
        setAvatar(avatarUrl);
        console.log("✅ Avatar uppdaterad:", avatarUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    console.log("🚪 Loggar ut användaren...");
    dispatch(logoutUser());
    navigate("/profile");
  };

  return (
    <div className="auth-container">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar-container">
            {avatar ? (
              <img src={avatar} alt="Profile" className="avatar" />
            ) : (
              <div className="avatar-placeholder" />
            )}
            <label htmlFor="avatarUpload" className="avatar-upload-label">
              <FaEdit />
            </label>
            <input
              type="file"
              id="avatarUpload"
              className="avatar-upload-input"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
            />
          </div>

          <div className="user-info">
            <p><strong>Username:</strong> {user?.name || "N/A"}</p>
            <p><strong>Email:</strong> {user?.email || "N/A"}</p>
            <p><strong>Role:</strong> {user?.isVenueManager ? "Venue Manager" : "Regular User"}</p>
          </div>
        </div>

        {/* Flikar */}
        <div className="profile-tabs">
          <button onClick={() => setActiveTab("bookings")} className={`profile-tab ${activeTab === "bookings" ? "active" : ""}`}>
            My Bookings
          </button>
          {user?.isVenueManager && (
            <button onClick={() => setActiveTab("venues")} className={`profile-tab ${activeTab === "venues" ? "active" : ""}`}>
              My Venues
            </button>
          )}
        </div>

        {/* Innehåll */}
        <div className="profile-content">
          {activeTab === "bookings" ? (
            loading ? (
              <p>Loading bookings...</p>
            ) : userBookings?.length > 0 ? (
              <div className="bookings-container">
                {userBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <p>No bookings yet.</p>
            )
          ) : (
            user?.isVenueManager && (
              <div>
                {user?.data?.venues?.length > 0 ? (
                  <ul>
                    {user.data.venues.map((venue, index) => (
                      <li key={index}>{venue.name || "Unnamed Venue"}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No venues yet.</p>
                )}
              </div>
            )
          )}
        </div>

        {/* Knappar */}
        <div className="profile-buttons">
          {user?.isVenueManager && (
            <button className="btn" onClick={() => setShowCreateVenue(true)}>
              Create Venue
            </button>
          )}
          <button className="btn logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        {showCreateVenue && (
          <CreateVenueForm onClose={() => setShowCreateVenue(false)} />
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
