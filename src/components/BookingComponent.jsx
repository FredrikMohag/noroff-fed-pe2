import axios from "axios";
import { addDays, differenceInDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BOOKINGS, API_KEY } from "../constants";
import useStore from "../store"; // Import the Zustand store
import "../styles/global.scss";

const BookingComponent = ({ venueId }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [guests, setGuests] = useState(1);
  const [pricePerNight, setPricePerNight] = useState(100);
  const [venue, setVenue] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Show confirmation modal
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Show success modal
  const vatRate = 0.25;

  // Fetch the user data from Zustand store
  const user = useStore((state) => state.user);
  const accessToken = user?.accessToken || null;  // Make sure accessToken is correctly retrieved

  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Fetching venue with ID: ${venueId}`);
    axios
      .get(`${API_BOOKINGS}/venues/${venueId}`)
      .then((res) => {

        setVenue(res.data);
        setPricePerNight(res.data.price); // Assuming price is part of venue data
      })
      .catch((err) => {
        console.error("Error fetching venue:", err);
      });
  }, [venueId]);

  const handleBooking = () => {
    if (!user || !accessToken) {
      console.log("User or accessToken not found. Redirecting to login.");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const bookingData = {
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests,
      venueId,
    };

    console.log("Booking data:", bookingData);

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = () => {
    if (!user || !accessToken) {
      console.log("User or accessToken not found. Redirecting to login.");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    const bookingData = {
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests,
      venueId,
    };

    axios
      .post(`${API_BOOKINGS}/bookings`, bookingData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Booking successful!");
        setShowConfirmModal(false); // Close the confirm modal
        setShowSuccessModal(true); // Show the success modal
      })
      .catch((err) => {
        console.error("Booking failed:", err.response?.data || err.message);
        alert("Booking failed, please check your credentials or try again.");
      });
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/profile"); // Navigate to profile page
  };

  // Calculate nights, VAT, and total amount
  const nights = Math.abs(differenceInDays(startDate, endDate));
  const vatAmount = (nights * pricePerNight * vatRate).toFixed(2);
  const totalAmount = (nights * pricePerNight * (1 + vatRate)).toFixed(2);

  return (
    <Card className="p-4 shadow-sm border-0">
      <h3 className="mb-3">Reserve your stay</h3>

      {venue && (
        <div className="mb-4">
          <h4>{venue.name}</h4>
          <p>{venue.description}</p>
          <p><strong>Location:</strong> {venue.location}</p>
        </div>
      )}

      {/* Date picker */}
      <Form.Group className="mb-3">
        <Form.Label>Select dates</Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <FaCalendarAlt
              style={{ cursor: "pointer" }}
              onClick={() => setCalendarVisible(!calendarVisible)}
            />
          </InputGroup.Text>
          <Form.Control
            readOnly
            value={
              startDate && endDate
                ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                : "Select date"
            }
          />
        </InputGroup>

        {calendarVisible && (
          <div className="mt-3">
            <DatePicker
              selected={startDate}
              onChange={(dates) => {
                const [start, end] = dates || [new Date(), addDays(new Date(), 1)];
                if (start <= end) {
                  setStartDate(start);
                  setEndDate(end);
                } else {
                  // Adjust the dates if startDate is after endDate
                  setStartDate(start);
                  setEndDate(addDays(start, 1)); // Default to the next day if the endDate is before startDate
                }
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              minDate={new Date()}
              inline
              calendarClassName="custom-calendar"
            />
          </div>
        )}
      </Form.Group>

      {/* Number of guests input */}
      <Form.Group className="mb-3">
        <Form.Label>Number of Guests</Form.Label>
        <Form.Control
          type="number"
          min="1"
          max={venue?.maxGuests || 10} // Ensure maxGuests is used from venue data
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </Form.Group>

      {/* Price and VAT summary */}
      <div className="d-flex justify-content-between">
        <p className="mb-1">Nights</p>
        <p className="mb-1">{nights}</p>
      </div>
      <div className="d-flex justify-content-between">
        <p className="mb-1">VAT (25%)</p>
        <p className="mb-1">${vatAmount}</p>
      </div>
      <div className="d-flex justify-content-between">
        <h4>Total</h4>
        <h4>${totalAmount}</h4>
      </div>

      {/* Booking Button */}
      <Button variant="primary" className="mt-3 w-100" onClick={handleBooking}>
        {user ? "Book" : "Log in"}
      </Button>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Please confirm your booking at {venue?.name} for {guests} guest{guests > 1 ? 's' : ''} from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel booking
          </Button>
          <Button variant="primary" onClick={handleConfirmBooking}>
            Book now
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
        <Modal.Header closeButton>
          <Modal.Title>Booking Successful!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {venue ? (
            <p>Congratulations! Your booking at {venue.name} is confirmed.</p>
          ) : (
            <p>Congratulations! Your booking is confirmed.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            View bookings
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default BookingComponent;
