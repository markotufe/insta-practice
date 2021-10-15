import { createSlice } from "@reduxjs/toolkit";

let firebaseError = "Firebase: Error";

const errorSlice = createSlice({
  name: "error",
  initialState: {
    errorMessage: "",
  },
  reducers: {
    setErrorMessage(state, action) {
      switch (action.payload) {
        case `${firebaseError} (auth/user-not-found).`:
          state.errorMessage = "Can't find user. Please try again";
          break;
        case `${firebaseError} (auth/wrong-password).`:
          state.errorMessage = "Please enter valid credentials";
          break;

        case `${firebaseError} (auth/email-already-in-use).`:
          state.errorMessage = "Email address is already taken";
          break;

        case `taken`:
          state.errorMessage = "Username is already taken";
          break;

        default:
          state.errorMessage = "";
          break;
      }
    },
    clearErrorMessage(state) {
      state.errorMessage = "";
    },
  },
});

export const { setErrorMessage, clearErrorMessage } = errorSlice.actions;

export default errorSlice.reducer;
