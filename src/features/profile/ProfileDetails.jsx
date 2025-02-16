import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useUserBookings from "../../hooks/useUserBookings";
import useUserStore from "../../store";
import BookingCard from "../bookings/BookingCard";
import { getAvatar, setAvatar } from "./avatarService";
import CreateVenueForm from "./CreateVenueForm";

const ProfileDetails = () => {
  console.log("🔵 ProfileDetails component rendered");

  const navigate = useNavigate();
  const { user, accessToken, logout } = useUserStore();

  console.log("🔹 Current user from Zustand:", user);
  console.log("🔸 Current accessToken from Zustand:", accessToken);

  const [avatar, setAvatarState] = useState(getAvatar() || user?.avatar?.url || null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [showCreateVenue, setShowCreateVenue] = useState(false);

  const { userBookings, loading } = useUserBookings(accessToken, user, navigate);

  useEffect(() => {
    if (!user) {
      console.log("🔴 User not found, redirecting to login");
      navigate("/login");
    }
  }, [user, navigate]);

  // 🔥 Logga och se om filtreringen fungerar som förväntat
  const filteredBookings = userBookings?.filter(booking => {
    console.log("Checking booking:", booking.userEmail, "with user email:", user?.email);
    return booking.userEmail === user?.email;
  });
  console.log("✅ Filtered bookings for user:", filteredBookings);

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
    console.log("🚪 Logging out user...");
    logout();
    navigate("/login");
  };

  return (
    <div className="auth-background">
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
              <p><strong>Role:</strong> {user?.venueManager ? "Venue Manager" : "Regular User"}</p>
            </div>
          </div>

          <div className="profile-tabs">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`profile-tab ${activeTab === "bookings" ? "active" : ""}`}
            >
              My Bookings
            </button>

            {user?.venueManager && (
              <button
                onClick={() => setActiveTab("venues")}
                className={`profile-tab ${activeTab === "venues" ? "active" : ""}`}
              >
                My Venues
              </button>
            )}
          </div>

          <div className="profile-content">
            {activeTab === "bookings" ? (
              loading ? (
                <p>Loading bookings...</p>
              ) : filteredBookings?.length > 0 ? ( // ⬅️ Bytt ut userBookings till filteredBookings
                <div className="bookings-container">
                  {filteredBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <p>No bookings yet.</p>
              )
            ) : (
              user?.venueManager && (
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

          <div className="profile-buttons">
            {user?.venueManager && (
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
    </div>
  );
};

export default ProfileDetails;
