import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isModalOpen: false,
  },
  reducers: {
    setModal(state, action) {
      state.isModalOpen = action.payload;
    },
  },
});

export const { setModal } = modalSlice.actions;

export default modalSlice.reducer;
