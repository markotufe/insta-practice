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
    followers: {
      listOfFollowers: [],
    },
    following: {
      listOfFollowing: [],
    },
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
  },
});

export const { setUser, setIsRegistered, setMyFollowers, setMyFollowing } =
  userSlice.actions;

export default userSlice.reducer;
