import axios from "axios";
import { API_BASE_URL, API_KEY } from "../../constants"; // Importera API-nyckeln

const AUTH_URL = `${API_BASE_URL}/auth`;

const register = async (userData) => {
  console.log("Sending registration request:", userData);

  const registrationData = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    bio: userData.bio || "",
    venueManager: userData.venueManager || false,
  };

  if (userData.avatarUrl) {
    registrationData.avatar = {
      url: userData.avatarUrl,
      alt: userData.avatarAlt || "",
    };
  }

  try {
    const response = await axios.post(`${AUTH_URL}/register`, registrationData, {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY, // Skicka API-nyckeln
      },
    });

    console.log("Registration response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

const login = async (credentials) => {
  console.log("Sending login request:", credentials);
  try {
    const response = await axios.post(
      `${AUTH_URL}/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY, // API-nyckeln måste skickas
        },
      }
    );

    console.log("Login response:", response.data);

    if (response.data.accessToken) {
      // Hämta fullständig användardata efter login
      const userProfile = await getUserProfile(response.data.accessToken);

      // Skapa ett objekt som innehåller både token och användardata
      const userData = { ...response.data, ...userProfile };

      localStorage.setItem("user", JSON.stringify(userData)); // Spara användaren i localStorage

      return userData;
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

const logout = () => {
  console.log("Logging out user");
  localStorage.removeItem("user");
};

const getUserProfile = async (token) => {
  console.log("Fetching user profile with token:", token);
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY, // Lägg till API-nyckeln här också
      },
    });

    console.log("User profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error("User profile fetch error:", error.response?.data || error.message);
    throw error;
  }
};

export default { register, login, logout, getUserProfile };
