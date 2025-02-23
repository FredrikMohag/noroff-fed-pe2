import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://v2.api.noroff.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
