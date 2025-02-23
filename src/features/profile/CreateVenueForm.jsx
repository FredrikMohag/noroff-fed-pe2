import React, { useState } from "react";
import { createVenue } from "../../service/venueService";

const CreateVenueForm = ({ addVenue, onClose }) => {

  const accessToken = localStorage.getItem("accessToken");


  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    images: "",
    maxGuests: 0,
    rating: 0,
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
    address: "",
    zip: "",
    city: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const venueData = {
      name: formData.name,
      description: formData.description,
      media: formData.images.split(",").map((url) => ({ url: url.trim(), alt: "Image" })),
      price: parseFloat(formData.price),
      maxGuests: parseInt(formData.maxGuests, 10),
      rating: parseInt(formData.rating, 10),
      meta: {
        wifi: formData.wifi,
        parking: formData.parking,
        breakfast: formData.breakfast,
        pets: formData.pets,
      },
      location: {
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        country: formData.country,
        continent: "Unknown",
        lat: 0,
        lng: 0,
      },
    };

    try {
      const result = await createVenue(venueData, accessToken);

      if (result) {
        addVenue(result);
        onClose();

      } else {

      }
    } catch (error) {

    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Create New Venue</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price per night</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Max Guests</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Images (comma-separated URLs)</label>
                <input
                  type="text"
                  className="form-control"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Rating (out of 5)</label>
                <input
                  type="number"
                  className="form-control"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="1"
                />
              </div>

              <div className="mb-3">
                <h6>Included</h6>
                {["wifi", "parking", "breakfast", "pets"].map((feature) => (
                  <div className="form-check" key={feature}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name={feature}
                      checked={formData[feature]}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">{feature.charAt(0).toUpperCase() + feature.slice(1)}</label>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <h6>Location</h6>
                <input
                  type="text"
                  className="form-control mb-2"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  name="zip"
                  placeholder="Zip"
                  value={formData.zip}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" style={{ color: "#000" }}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVenueForm;
