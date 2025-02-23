import axios from "axios";
import { addDays } from "date-fns";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BOOKINGS, API_KEY } from "../constants";
import useUserStore from "../store";

const CalendarComponent = ({ venueId, startDate, setStartDate, endDate, setEndDate }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const { accessToken, userBookings } = useUserStore((state) => state);

  const fetchBookedDates = async () => {
    try {
      const response = await axios.get(`${API_BOOKINGS}/bookings?venueId=${venueId}&_venue=true`, {
        headers: {
          "X-Noroff-API-Key": API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!Array.isArray(response.data.data)) {
        return;
      }

      const apiBookings = response.data.data || [];
      const allBookings = [...apiBookings, ...(Array.isArray(userBookings) ? userBookings : [])];

      const dates = allBookings.flatMap((booking) => {
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
    } catch (error) { }
  };

  const isDateBooked = (date) => {
    if (!(date instanceof Date)) return false;
    return bookedDates.some((bookedDate) => bookedDate.getTime() === date.getTime());
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={(dates) => {
        if (dates && dates.length === 2) {
          const [start, end] = dates;

          const isStartBooked = isDateBooked(start);
          const isEndBooked = end && isDateBooked(end);

          if (isStartBooked || isEndBooked) {
            alert("En eller båda av de valda datumen är redan bokade!");
            return;
          }

          if (start && !end) {
            setStartDate(start);
            setEndDate(null);
          } else if (start && end && start <= end) {
            setStartDate(start);
            setEndDate(end);
          } else if (start && end && start > end) {
            setStartDate(end);
            setEndDate(start);
          }
        }
      }}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      minDate={new Date()}
      excludeDates={bookedDates}
      highlightDates={bookedDates}
      inline
      calendarClassName="custom-calendar"
    />
  );
};

export default CalendarComponent;
