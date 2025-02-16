import { API_KEY, BASE_API_URL } from "../../constants";

// Funktion för att skapa en bokning
export const createBooking = async (accessToken, bookingData) => {
  try {
    const url = `${BASE_API_URL}/holidaze/bookings`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error("Failed to create booking");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};
