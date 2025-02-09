import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  avatar: null,
  profileData: null, // Om du vill lagra mer profilinformation
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    clearProfile: (state) => {
      state.avatar = null;
      state.profileData = null;
    },
  },
});

export const { setAvatar, setProfileData, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
