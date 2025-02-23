import { API_BOOKINGS, API_KEY } from "../constants";
import apiClient from "./apiClient";

// Hämtar användarens bokningar med extra detaljer om kund och venue
export const fetchUserBookings = async (username, token) => {
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/holidaze/profiles/${username}/bookings?_customer=true&_venue=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
};

// Skapar en ny bokning
export const bookVenue = async (bookingData, accessToken) => {
  if (!accessToken) {
    return null;
  }

  try {
    const response = await apiClient.post("/holidaze/bookings", bookingData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "X-Noroff-API-Bookings": API_BOOKINGS,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBookingsForVenue = async (venueId, accessToken) => {
  try {
    const response = await fetch(`/api/bookings?venueId=${venueId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    const data = await response.json();
    if (data && Array.isArray(data.bookings)) {
      return data.bookings.length;
    }
    throw new Error("Error fetching bookings");
  } catch (error) {
    throw error;
  }
};
