import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isModalOpen: false,
    isFollowingModalOpen: false,
    isFollowersModalOpen: false,
    isPostModalOpen: false,
  },
  reducers: {
    setModal(state, action) {
      state.isModalOpen = action.payload;
    },
    setFollowingModal(state, action) {
      state.isFollowingModalOpen = action.payload;
    },
    setFollowersModal(state, action) {
      state.isFollowersModalOpen = action.payload;
    },
    setIsPostModalOpen(state, action) {
      state.isPostModalOpen = action.payload;
    },
  },
});

export const {
  setModal,
  setFollowingModal,
  setFollowersModal,
  setIsPostModalOpen,
} = modalSlice.actions;

export default modalSlice.reducer;
