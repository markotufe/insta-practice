import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    userError: "",
  },
  reducers: {
    setUser(state, action) {
      state.userData = action.payload;
    },
    setUserError(state, action) {
      state.userError = action.payload;
    },
  },
});

export const { setUser, setUserError } = userSlice.actions;

export default userSlice.reducer;
