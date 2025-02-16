import axios from "axios";
import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BOOKINGS, API_KEY } from "../constants";

const CalendarComponent = ({ venueId, startDate, setStartDate, endDate, setEndDate }) => {
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get(`${API_BOOKINGS}/bookings?venueId=${venueId}`, {
          headers: { "X-Noroff-API-Key": API_KEY },
        });

        const bookings = response.data.data || [];
        console.log("📅 Booked dates:", bookings);

        const dates = bookings.flatMap((booking) => {
          const from = new Date(booking.dateFrom);
          const to = new Date(booking.dateTo);
          const days = [];
          let current = from;
          while (current <= to) {
            days.push(new Date(current));
            current = addDays(current, 1);
          }
          return days;
        });

        setBookedDates(dates);
      } catch (error) {
        console.error("❌ Error fetching booked dates:", error);
      }
    };

    fetchBookedDates();
  }, [venueId]);

  return (
    <DatePicker
      selected={startDate}
      onChange={(dates) => {
        const [start, end] = dates || [new Date(), addDays(new Date(), 1)];
        if (start <= end) {
          setStartDate(start);
          setEndDate(end);
        } else {
          setStartDate(start);
          setEndDate(addDays(start, 1));
        }
      }}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      minDate={new Date()}
      excludeDates={bookedDates} // Markerar bokade datum som otillgängliga
      inline
      calendarClassName="custom-calendar"
    />
  );
};

export default CalendarComponent;
