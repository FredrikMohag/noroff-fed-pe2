import React, { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup, Modal } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../components/booking/bookingService"; // Importera vår nya service
import useStore from "../store";
import "../styles/global.scss";
import CalendarComponent from "./CalendarComponent";

const BookingComponent = ({ venueId }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [guests, setGuests] = useState(1);
  const [pricePerNight, setPricePerNight] = useState(100);
  const [venue, setVenue] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const vatRate = 0.25;

  const user = useStore((state) => state.user);
  const accessToken = user?.accessToken || null;
  const navigate = useNavigate();

  useEffect(() => {
    // Här hämtar vi platsens detaljer från API
    axios
      .get(`${API_BOOKINGS}/venues/${venueId}`)
      .then((res) => {
        setVenue(res.data);
        setPricePerNight(res.data.price);
      })
      .catch((err) => console.error("❌ Error fetching venue:", err));
  }, [venueId]);

  const handleBooking = () => {
    console.log("🔹 Handling booking...");
    if (!user || !accessToken) {
      navigate("/login");
      return;
    }
    setShowConfirmModal(true);
    console.log("🔹 Show confirm modal:", showConfirmModal); // Kontrollera om tillståndet ändras
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
      const response = await createBooking(accessToken, bookingData);  // Använder vår nya service
      useStore.getState().addBooking(response.data); // Lägg till bokningen i store
      setShowConfirmModal(false);  // Stänger bekräftelsemodalen
      setShowSuccessModal(true);   // Öppnar successmodalen
    } catch (err) {
      console.error("❌ Bokning misslyckades:", err.response?.data || err.message);
      alert("Bokningen misslyckades, vänligen försök igen.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/profile");
  };

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
            value={startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : "Select date"}
          />
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

      {/* Number of guests input */}
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
          <Modal.Title>Booking Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your booking at {venue?.name} has been successfully confirmed for {guests} guest{guests > 1 ? 's' : ''} from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            Go to Profile
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default BookingComponent;
