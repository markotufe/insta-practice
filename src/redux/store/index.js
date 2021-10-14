import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";

//nasi reduceri
const reducer = combineReducers({
  user: userReducer,
});

const store = configureStore({
  reducer,
});

export default store;
