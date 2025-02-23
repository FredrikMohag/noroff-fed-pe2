import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getAvatar } from "../../service/avatarService";
import { deleteVenue, fetchVenues } from "../../service/venueService";
import useUserStore from "../../store";
import AvatarUrlModal from "./AvatarUrlModal";
import CreateVenueForm from "./CreateVenueForm";
import DeleteVenueModal from "./DeleteVenueModal";
import MyBookings from "./MyBookings";
import MyVenues from "./MyVenues";

const ProfileDetails = () => {
  const navigate = useNavigate();
  const { user, logout, isVenueManager, accessToken, avatar, setAvatar } = useUserStore();
  const [activeTab, setActiveTab] = useState("bookings");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [venues, setVenues] = useState([]);
  const [showCreateVenue, setShowCreateVenue] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const addVenue = useUserStore((state) => state.addVenue);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const userAvatar = getAvatar();
    setAvatar(userAvatar);
  }, []);

  const handleAvatarChange = (newAvatarUrl) => {
    const newAvatar = { url: newAvatarUrl, alt: "User Avatar" };
    setAvatar(newAvatar);
  };

  useEffect(() => {
    const getVenues = async () => {
      if (user?.email && isVenueManager && accessToken) {
        try {
          const fetchedVenues = await fetchVenues(user.name, accessToken);
          if (fetchedVenues?.data && Array.isArray(fetchedVenues.data)) {
            localStorage.setItem("userVenues", JSON.stringify(fetchedVenues.data));
            setVenues(fetchedVenues.data);
          }
        } catch (error) { }
      }
    };

    getVenues();
  }, [user, isVenueManager, accessToken]);

  const handleDeleteVenue = async (venueId) => {
    try {
      const success = await deleteVenue(venueId, accessToken);
      if (success) {
        setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== venueId));
      }
    } catch (error) { }
  };

  const handleLogout = () => {
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
                <img src={avatar.url} alt={avatar.alt} className="avatar" />
              ) : (
                <div className="avatar-placeholder">
                  <p>No avatar uploaded</p>
                </div>
              )}
              <label htmlFor="avatarUpload" className="avatar-upload-label">
                <FaEdit onClick={() => setShowAvatarModal(true)} />
              </label>
            </div>
            <div className="user-info">
              <p><strong>Username:</strong> {user?.name || "N/A"}</p>
              <p><strong>Email:</strong> {user?.email || "N/A"}</p>
              <p><strong>Role:</strong> {isVenueManager ? "Venue Manager" : "Regular User"}</p>
            </div>
          </div>

          <div className="profile-tabs">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`profile-tab ${activeTab === "bookings" ? "active" : ""}`}
            >
              My Bookings
            </button>

            {isVenueManager && (
              <button
                onClick={() => setActiveTab("venues")}
                className={`profile-tab ${activeTab === "venues" ? "active" : ""}`}
              >
                My Venues
              </button>
            )}
          </div>

          <div className="profile-content">
            {activeTab === "bookings" && <MyBookings />}

            {activeTab === "venues" && isVenueManager && (
              <MyVenues venues={venues} setVenues={setVenues} />
            )}
          </div>

          <div className="profile-buttons">
            {isVenueManager && (
              <button className="btn" onClick={() => setShowCreateVenue(true)}>
                Create Venue
              </button>
            )}
            <button className="btn logout" onClick={handleLogout}>
              Log Out
            </button>
          </div>

          {showCreateVenue && (
            <CreateVenueForm
              addVenue={addVenue}
              onClose={() => setShowCreateVenue(false)}
              setVenues={setVenues}
            />
          )}

          {showDeleteModal && (
            <DeleteVenueModal
              venueId={venueToDelete}
              onDelete={handleDeleteVenue}
              onCancel={() => setShowDeleteModal(false)}
            />
          )}
        </div>
      </div>

      <AvatarUrlModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />
    </div>
  );
};

export default ProfileDetails;
