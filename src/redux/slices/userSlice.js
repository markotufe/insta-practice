import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {
      displayName: "",
      email: "",
      following: [],
      followers: [],
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
    updateUserFollowing(state, action) {
      state.userData.following = action.payload.followAction
        ? [...state.userData.following, action.payload.userToFollowId]
        : state.userData.following.filter(
            (userId) => userId !== action.payload.userToFollowId
          );
    },
  },
});

export const { setUser, setIsRegistered, updateUserFollowing } =
  userSlice.actions;

export default userSlice.reducer;
