import axios from "axios";
import { API_HOLIDAZE_URL, API_KEY } from "../../constants";

export const fetchBookings = async (token, params = {}) => {
  try {
    console.log("Fetching bookings...");
    console.log("Token:", token);
    console.log("Params:", params);

    const response = await axios.get(`${API_HOLIDAZE_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      params,
    });

    console.log("API response:", response);
    console.log("API response data:", response.data);

    if (!response.data || !Array.isArray(response.data.data)) {
      console.error("API returnerade oväntat format:", response.data);
      return [];
    }

    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch bookings:", error.response?.data || error.message);
    return [];
  }
};
