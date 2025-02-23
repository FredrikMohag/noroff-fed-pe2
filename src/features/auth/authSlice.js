import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const userFromStorage = localStorage.getItem("user");
const parsedUser = userFromStorage ? JSON.parse(userFromStorage) : null;

const initialState = {
  user: parsedUser,
  accessToken: parsedUser?.accessToken || null,
  name: parsedUser?.name || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      const updatedUserData = {
        ...response,
        name: response.id || response.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      return updatedUserData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      const updatedUserData = {
        ...response,
        name: response.id || response.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      return updatedUserData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  authService.logout();
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    manualLogout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.name = null;
      localStorage.removeItem("user");
      localStorage.removeItem("userVenues");
      localStorage.removeItem("userBookings");
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.accessToken = action.payload.accessToken;
        state.name = action.payload.name;
        state.message = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "An error occurred during login.";
      })
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
        state.accessToken = action.payload.accessToken;
        state.name = action.payload.name;
        state.message = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "An error occurred during registration.";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.accessToken = null;
        state.name = null;
        state.message = "Logged out successfully";
      });
  },
});

export const { manualLogout } = authSlice.actions;
export default authSlice.reducer;
