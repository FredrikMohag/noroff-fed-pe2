import axios from "axios";
import { differenceInDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup, Modal } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_BOOKINGS } from "../constants";
import { bookVenue } from "../service/bookingService";
import useUserStore from "../store";
import CalendarComponent from "./CalendarComponent";

const getDateOnly = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const BookingComponent = ({ venueId }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [venue, setVenue] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { user, accessToken, bookings, addBooking, setBookings } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !accessToken) return;
  }, [user, accessToken, navigate]);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await axios.get(`${API_BOOKINGS}/venues/${venueId}`);
        setVenue(response.data);
      } catch (err) { }
    };

    if (venueId) {
      fetchVenue();
      fetchBookings();
    }
  }, [venueId]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BOOKINGS}/bookings`);

      if (Array.isArray(response.data)) {
        const venueBookings = response.data.filter(booking => booking.venueId === venueId);
        useUserStore.getState().setBookings(venueBookings || []);
      }
    } catch (err) { }
  };

  const isDateAvailable = (start, end) => {
    if (!Array.isArray(bookings)) {
      return false;
    }

    const startOnly = getDateOnly(start);
    const endOnly = getDateOnly(end);

    return !bookings.some((booking) => {
      const bookedFromOnly = getDateOnly(new Date(booking.dateFrom));
      const bookedToOnly = getDateOnly(new Date(booking.dateTo));
      return (
        (startOnly >= bookedFromOnly && startOnly <= bookedToOnly) ||
        (endOnly >= bookedFromOnly && endOnly <= bookedToOnly) ||
        (startOnly <= bookedFromOnly && endOnly >= bookedToOnly)
      );
    });
  };

  const handleBooking = () => {
    if (!user || !accessToken) {
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      alert("Vänligen välj både start- och slutdatum.");
      return;
    }

    if (!isDateAvailable(startDate, endDate)) {
      alert("De valda datumen är redan bokade. Välj andra datum.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!user || !accessToken) {
      navigate("/login");
      return;
    }

    const bookingData = {
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests,
      venueId,
      venueName: venue?.name,
      userEmail: user.email,
    };

    try {
      const response = await bookVenue(bookingData, accessToken);
      addBooking(bookingData);
      await fetchBookings();

      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      alert("Bokningen misslyckades, vänligen försök igen.");
    }
  };

  const nights = startDate && endDate ? Math.max(differenceInDays(endDate, startDate), 0) : 0;
  const pricePerNight = venue?.price || 0;
  const totalPrice = nights * pricePerNight;
  const vatAmount = totalPrice * 0.25; // 25% VAT
  const totalAmount = totalPrice + vatAmount;

  const formatDate = (date) => {
    return date && date instanceof Date && !isNaN(date)
      ? date.toLocaleDateString()
      : "";
  };

  return (
    <Card className="p-4 shadow-sm border-0">
      <h3 className="mb-3">Reserve your stay</h3>

      {venue && (
        <div className="mb-4">
          <h4>{venue.name}</h4>
          <p>{venue.description}</p>
        </div>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Select dates</Form.Label>
        <InputGroup>
          <InputGroup.Text>
            <FaCalendarAlt onClick={() => setCalendarVisible(!calendarVisible)} />
          </InputGroup.Text>
          <Form.Control readOnly value={`${formatDate(startDate)} - ${formatDate(endDate)}`} />
        </InputGroup>
        {calendarVisible && (
          <CalendarComponent
            venueId={venueId}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Number of Guests</Form.Label>
        <Form.Control
          type="number"
          min="1"
          max={venue?.maxGuests || 10}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </Form.Group>

      <div className="d-flex justify-content-between">
        <p className="mb-1">Nights</p>
        <p className="mb-1">{nights}</p>
      </div>

      <div className="d-flex justify-content-between">
        <p className="mb-1">VAT (25%)</p>
        <p className="mb-1">${vatAmount.toFixed(2)}</p>
      </div>
      <div className="d-flex justify-content-between">
        <h4>Total</h4>
        <h4>${totalAmount.toFixed(2)}</h4>
      </div>

      <Button variant="primary" className="mt-3 w-100" onClick={handleBooking}>
        {user ? "Book" : "Log in"}
      </Button>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bekräfta din bokning på {venue?.name} för {guests} gäster från{" "}
          {formatDate(startDate)} till {formatDate(endDate)}.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Avbryt</Button>
          <Button variant="primary" onClick={handleConfirmBooking}>Boka nu</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default BookingComponent;
