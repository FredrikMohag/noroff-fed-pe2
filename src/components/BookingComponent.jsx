import axios from "axios";
import { addDays, differenceInDays } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_HOLIDAZE_URL, API_KEY } from "../constants";
import "../styles/global.scss";

const BookingComponent = ({ venueId }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [guests, setGuests] = useState(1);
  const [pricePerNight, setPricePerNight] = useState(100);
  const [venue, setVenue] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const vatRate = 0.25;

  const user = useSelector((state) => state.auth.user); // Hämtar användaren från Redux
  const token = user?.accessToken; // Hämtar access token
  const navigate = useNavigate();

  console.log("User in Redux: ", user); // För att kontrollera om användaren finns
  console.log("Token: ", token); // För att kontrollera om token finns

  useEffect(() => {
    console.log(`Fetching venue with ID: ${venueId}`); // För att se vilken venue vi hämtar
    axios
      .get(`${API_HOLIDAZE_URL}/venues/${venueId}`)
      .then((res) => {
        console.log("Venue data: ", res.data); // För att se om vi får korrekt data från API
        setVenue(res.data);
        setPricePerNight(res.data.price);
      })
      .catch((err) => console.error("Error fetching venue:", err));
  }, [venueId]);

  const handleBooking = () => {
    console.log("Handling booking...");

    // Kontrollera om användaren är inloggad och har token
    if (!user || !user.accessToken) {
      console.log("User or token not found. Redirecting to login.");
      navigate("/login"); // Om inte, skicka användaren till login-sidan
      return;
    }

    const bookingData = {
      dateFrom: startDate.toISOString(),
      dateTo: endDate.toISOString(),
      guests,
      venueId,
    };

    console.log("Booking data: ", bookingData); // För att se vad vi skickar med i bokningen

    axios
      .post(`${API_HOLIDAZE_URL}/bookings`, bookingData, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`, // Skicka token här
          "X-Noroff-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        console.log("Booking successful!");
        alert("Booking successful!");
      })
      .catch((err) => {
        console.error("Booking failed:", err.response?.data || err.message);
        alert("Booking failed, please check your credentials or try again.");
      });
  };


  const nights = differenceInDays(endDate, startDate);
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
                setStartDate(dates?.[0] || new Date());
                setEndDate(dates?.[1] || addDays(new Date(), 1));
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
        <p className="mb-1">${vatAmount}</p>
      </div>
      <div className="d-flex justify-content-between">
        <h4>Total</h4>
        <h4>${totalAmount}</h4>
      </div>

      <Button variant="primary" className="mt-3 w-100" onClick={handleBooking}>
        {user ? "Book" : "Log in"}
      </Button>
    </Card>
  );
};

export default BookingComponent;
