import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    isRegistered: false,
    userError: "",
  },
  reducers: {
    setUser(state, action) {
      state.userData = action.payload;
    },
    setUserError(state, action) {
      state.userError = action.payload;
    },
    setIsRegistered(state, action) {
      state.isRegistered = action.payload;
    },
  },
});

export const { setUser, setUserError, setIsRegistered } = userSlice.actions;

export default userSlice.reducer;
