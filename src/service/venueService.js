import { API_KEY } from "../constants";
import useUserStore from "../store";
import apiClient from "./apiClient";

export const fetchVenues = async (profileName, token) => {
  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/holidaze/profiles/${profileName}/venues`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
      }
    );

    const rawResponse = await response.text();

    if (!response.ok) {
      throw new Error('Failed to fetch venues');
    }

    try {
      const data = JSON.parse(rawResponse);
      return data;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    return [];
  }
};


export const createVenue = async (venueData) => {
  const { user, accessToken } = useUserStore.getState();


  if (!user || !user.email || !accessToken) {
    return null;
  }

  const venueWithOwner = {
    ...venueData,
    owner: { email: user.email },
  };

  try {
    const response = await apiClient.post("/holidaze/venues", venueWithOwner, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVenue = async (id, venueData) => {
  try {
    const response = await apiClient.put(`/holidaze/venues/${id}`, venueData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteVenue = async (venueId) => {
  const { accessToken } = useUserStore.getState();

  if (!accessToken) {
    throw new Error("No access token");
  }

  try {
    const response = await apiClient.delete(`/holidaze/venues/${venueId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (response.status === 204) {
      return true;
    } else {
      throw new Error('Error deleting venue');
    }
  } catch (error) {
    throw error;
  }
};
