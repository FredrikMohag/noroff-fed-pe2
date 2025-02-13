import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

// Hämta användaren från localStorage vid start
const userFromStorage = localStorage.getItem("user");
const parsedUser = userFromStorage ? JSON.parse(userFromStorage) : null;

// Initial state för authSlice
const initialState = {
  user: parsedUser,
  token: parsedUser?.accessToken || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Async thunk för login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      localStorage.setItem("user", JSON.stringify(response.data)); // Spara i localStorage
      return response.data; // Returnera data till Redux
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Async thunk för registrering
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem("user", JSON.stringify(response.data)); // Spara i localStorage
      return response.data;
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data || "Registration failed"
      );
    }
  }
);

// Async thunk för logout
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  authService.logout();
  localStorage.removeItem("user"); // Rensa användaren från localStorage
  return null;
});

// Skapa slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    manualLogout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login reducers
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.token = action.payload.accessToken;
        state.message = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "An error occurred during login.";
      })

      // Register reducers
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.token = action.payload.accessToken;
        state.message = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.payload || "An error occurred during registration.";
      })

      // Logout reducers
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.token = null;
        state.message = "Logged out successfully";
      });
  },
});

export const { manualLogout } = authSlice.actions;
export default authSlice.reducer;
