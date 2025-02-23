import React from "react";

const DeleteVenueModal = ({ venueId, onDelete, onCancel }) => {
  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this venue?</p>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-danger"
              onClick={() => onDelete(venueId)}
            >
              Delete
            </button>
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteVenueModal;
