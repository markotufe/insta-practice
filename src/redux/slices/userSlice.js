import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {
      displayName: "",
      email: "",
      registeredAt: "",
      userId: "",
      photoURL: null,
      fullName: "",
    },
    isRegistered: false,
  },
  reducers: {
    setUser(state, action) {
      state.userData = action.payload;
    },
    setIsRegistered(state, action) {
      state.isRegistered = action.payload;
    },
  },
});

export const { setUser, setIsRegistered } = userSlice.actions;

export default userSlice.reducer;
