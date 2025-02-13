// store.js
import { configureStore } from "@reduxjs/toolkit";
import { loadLocal } from "../utils/localStorage.js";
import authReducer from "./features/auth/authSlice";

// Hämta användaren från localStorage (eller null om inget finns)
const loadUserFromStorage = () => {
  return loadLocal("user");
};

// Skapa Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,  // Din authSlice
  },
  preloadedState: {
    auth: { user: loadUserFromStorage() }, // Ladda användaren från localStorage
  },
});

export default store;
