import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../auth/authSlice";
import { setAvatar } from "../profile/profileSlice";
import CreateVenueForm from "./CreateVenueForm";

const ProfileDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hämta användardata från Redux store
  const user = useSelector((state) => state.auth.user);
  const avatar = useSelector((state) => state.profile.avatar); // Hämta avatar från Redux

  // Om ingen användare är inloggad, skicka tillbaka till login-sidan
  useEffect(() => {
    if (!user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Visa inget medan vi navigerar bort
  }

  console.log("Inloggad användare:", user);

  const [activeTab, setActiveTab] = useState("bookings");
  const [showCreateVenue, setShowCreateVenue] = useState(false);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarUrl = reader.result;
        dispatch(setAvatar(avatarUrl)); // Uppdatera avatar i Redux
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/profile");
  };

  return (
    <div className="profile-container">
      {/* PROFILSEKTION */}
      <div className="profile-header">
        <div className="avatar-container">
          {avatar ? (
            <img src={avatar} alt="Profile" className="avatar" />
          ) : (
            <div className="avatar-placeholder" />
          )}

          {/* Endast ikonen som är länken till att ladda upp en avatar */}
          <label htmlFor="avatarUpload" className="avatar-upload-label">
            <FaEdit />
          </label>

          <input
            type="file"
            id="avatarUpload"
            className="avatar-upload-input"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }} // Döljer den faktiska inputen
          />
        </div>

        {/* Användarinformation */}
        <div className="user-info">
          <p><strong>Username:</strong> {user?.name || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p><strong>Role:</strong> {user?.isVenueManager ? "Venue Manager" : "Regular User"}</p>
        </div>
      </div>

      {/* Flikar (Tabs) */}
      <div className="profile-tabs">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`profile-tab ${activeTab === "bookings" ? "active" : ""}`}
        >
          My Bookings
        </button>

        {user.data?.isVenueManager && (
          <button
            onClick={() => setActiveTab("venues")}
            className={`profile-tab ${activeTab === "venues" ? "active" : ""}`}
          >
            My Venues
          </button>
        )}
      </div>

      {/* INNEHÅLL */}
      <div className="profile-content">
        {activeTab === "bookings" ? (
          user.data?.bookings && user.data.bookings.length > 0 ? (
            <ul>
              {user.data.bookings.map((booking, index) => (
                <li key={index}>{booking}</li>
              ))}
            </ul>
          ) : (
            <p>No bookings yet.</p>
          )
        ) : (
          user.data?.isVenueManager &&
          (user.data?.venues && user.data.venues.length > 0 ? (
            <ul>
              {user.data.venues.map((venue, index) => (
                <li key={index}>{venue}</li>
              ))}
            </ul>
          ) : (
            <p>No venues yet.</p>
          ))
        )}
      </div>

      {/* KNAPPAR FÖR SKAPA VENUE OCH LOGGA UT */}
      <div className="profile-buttons">
        {user.data?.isVenueManager && (
          <button className="btn" onClick={() => setShowCreateVenue(true)}>
            Create Venue
          </button>
        )}
        <button className="btn logout" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* MODAL FÖR SKAPA VENUE */}
      {showCreateVenue && <CreateVenueForm onClose={() => setShowCreateVenue(false)} />}
    </div>
  );
};

export default ProfileDetails;
