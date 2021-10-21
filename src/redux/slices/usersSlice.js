import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    followers: {
      listOfFollowers: [],
    },
    following: {
      listOfFollowing: [],
    },
  },
  reducers: {
    setUserFollowers(state, action) {
      state.followers = {
        listOfFollowers: action.payload.listOfFollowers,
      };
    },
    setUserFollowing(state, action) {
      state.following = {
        listOfFollowing: action.payload.listOfFollowing,
      };
    },
  },
});

export const { setUserFollowers, setUserFollowing } = userSlice.actions;

export default userSlice.reducer;
