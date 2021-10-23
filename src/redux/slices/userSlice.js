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
    isCreatingPost: false,
    followers: {
      listOfFollowers: [],
    },
    following: {
      listOfFollowing: [],
    },
    usersToFollow: [],
  },
  reducers: {
    setUser(state, action) {
      state.userData = action.payload;
    },
    setIsRegistered(state, action) {
      state.isRegistered = action.payload;
    },
    setMyFollowers(state, action) {
      state.followers = {
        listOfFollowers: action.payload.listOfFollowers,
      };
    },
    setMyFollowing(state, action) {
      state.following = {
        listOfFollowing: action.payload.listOfFollowing,
      };
    },
    setUsersToFollow(state, action) {
      state.usersToFollow = action.payload;
    },
    setIsCreatingPost(state, action) {
      state.isCreatingPost = action.payload;
    },
  },
});

export const {
  setUser,
  setIsRegistered,
  setMyFollowers,
  setMyFollowing,
  setUsersToFollow,
  setIsCreatingPost,
} = userSlice.actions;

export default userSlice.reducer;
