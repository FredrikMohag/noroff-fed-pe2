import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: { user: userFromStorage }, // Ladda användaren från localStorage vid start
  },
});

export default store;
