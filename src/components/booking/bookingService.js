import { API_KEY, BASE_API_URL } from "../../constants";

export const fetchBookings = async (accessToken, userName) => {
  try {
    // Kontrollera att BASE_API_URL och userName används rätt här
    const url = `${BASE_API_URL}/holidaze/bookings?user=${userName}`;
    console.log('Fetching bookings from:', url); // Debugging - kollar om URL är korrekt

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Lägger till accessToken i headers
        "X-Noroff-API-Key": API_KEY, // Lägger till API_KEY i headers
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }

    const data = await response.json(); // Om svaret är OK, returnera datan
    return data;
  } catch (error) {
    console.error("Error fetching bookings:", error); // Felsökning vid error
    throw error;
  }
};
