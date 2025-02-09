import axios from "axios";
import { API_BASE_URL, API_KEY } from "../../constants";

const AUTH_URL = `${API_BASE_URL}/auth`;

const register = async (userData) => {
  console.log("Sending registration request:", userData);

  // Skapa JSON-data
  const registrationData = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    bio: userData.bio || "",
    venueManager: userData.venueManager || false,  // Här sätts venueManager
  };


  // Lägg till avatar om användaren angett en URL
  if (userData.avatarUrl) {
    registrationData.avatar = {
      url: userData.avatarUrl,
      alt: userData.avatarAlt || "",
    };
  }

  const response = await axios.post(`${AUTH_URL}/register`, registrationData, {
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY, // Skicka API-nyckeln
    },
  });

  console.log("Registration response:", response.data);
  return response.data;
};

const login = async (credentials) => {
  console.log("Sending login request:", credentials);
  const response = await axios.post(`${AUTH_URL}/login`, credentials);
  console.log("Login response:", response.data);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data)); // Spara användaren i localStorage
  }
  return response.data;
};

const logout = () => {
  console.log("Logging out user");
  localStorage.removeItem("user");
};

const getUserProfile = async (token) => {
  console.log("Fetching user profile with token:", token);
  const response = await axios.get(`${API_BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("User profile response:", response.data);
  return response.data;
};

export default { register, login, logout, getUserProfile };
