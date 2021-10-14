import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import modalReducer from "../slices/modalSlice";

//nasi reduceri
const reducer = combineReducers({
  user: userReducer,
  modal: modalReducer,
});

const store = configureStore({
  reducer,
});

export default store;
