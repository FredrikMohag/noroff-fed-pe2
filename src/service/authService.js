import axios from "axios";
import { API_KEY, BASE_API_URL } from "../constants";
import useUserStore from "../store";

const AUTH_URL = `${BASE_API_URL}/auth`;

const register = async (userData) => {
  try {
    const registrationData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      bio: userData.bio || "",
      venueManager: userData.venueManager || false,
      avatar: userData.avatarUrl
        ? { url: userData.avatarUrl, alt: userData.avatarAlt || "" }
        : undefined,
    };

    const response = await axios.post(`${AUTH_URL}/register`, registrationData, {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("🔴 Registration error:", error.response?.data || error.message);
    throw error;
  }
};

const login = async ({ email, password }) => {
  try {
    const response = await axios.post(
      `${AUTH_URL}/login?_holidaze=true`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    const accessToken = response.data.accessToken || response.data?.accessToken || "default-token";
    const profile = response.data.data;

    if (!accessToken) {
      throw new Error("Login failed: No accessToken received.");
    }

    // Save the user in Zustand
    useUserStore.getState().login(profile, accessToken, profile?.venueManager, profile?.avatar);

    return response.data;
  } catch (error) {
    console.error("🔴 Error logging in:", error.response?.data || error.message);
    throw error;
  }
};

const logout = () => {
  useUserStore.getState().logout();
};

export default { register, login, logout };
