import React, { useState } from "react";

const CreateVenueForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    images: "",
    maxGuests: 0, // Starta med 0 gäster
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting venue:", formData);
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Create New Booking</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="name" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" onChange={handleChange} required></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price per night</label>
                  <input type="number" className="form-control" name="price" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Max Guests</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxGuests"
                    onChange={handleChange}
                    value={formData.maxGuests} // Ställ in maxGuests till 0 som standardvärde
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Images (comma-separated URLs)</label>
                <input type="text" className="form-control" name="images" onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Rating (out of 5)</label>
                <input
                  type="number"
                  className="form-control"
                  name="rating"
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="1"
                  value={formData.rating}
                />
              </div>

              <div className="mb-3">
                <h6>Included</h6>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="wifi" onChange={handleChange} />
                  <label className="form-check-label">Wifi</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="parking" onChange={handleChange} />
                  <label className="form-check-label">Parking</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="breakfast" onChange={handleChange} />
                  <label className="form-check-label">Breakfast</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="pets" onChange={handleChange} />
                  <label className="form-check-label">Pets</label>
                </div>
              </div>

              <div className="mb-3">
                <h6>Location</h6>
                <input type="text" className="form-control mb-2" name="address" placeholder="Address" onChange={handleChange} />
                <input type="text" className="form-control mb-2" name="zip" placeholder="Zip" onChange={handleChange} />
                <input type="text" className="form-control mb-2" name="city" placeholder="City" onChange={handleChange} />
                <input type="text" className="form-control" name="country" placeholder="Country" onChange={handleChange} />
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
