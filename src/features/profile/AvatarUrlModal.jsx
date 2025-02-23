import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import useUserStore from "../../store";

const AvatarUrlModal = ({ isOpen, onClose }) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const { setAvatar: updateAvatarInStore } = useUserStore();

  const handleInputChange = (event) => {
    setAvatarUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (avatarUrl) {
      const avatarObject = {
        url: avatarUrl,
        alt: "User Avatar",
      };
      updateAvatarInStore(avatarObject);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={() => {
          onClose();
        }}>
          <FaTimes />
        </button>
        <h2>Update Avatar URL</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-input">
            <label htmlFor="avatarUrl">Avatar URL:</label>
            <input
              type="url"
              id="avatarUrl"
              value={avatarUrl}
              onChange={handleInputChange}
              placeholder="Enter image URL"
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">Update Avatar</button>
            <button type="button" onClick={() => {
              onClose();
            }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvatarUrlModal;
