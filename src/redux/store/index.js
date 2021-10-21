import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import usersSlice from "../slices/usersSlice";
import modalReducer from "../slices/modalSlice";
import errorReducer from "../slices/errorsSlice";

//nasi reduceri
const reducer = combineReducers({
  user: userReducer,
  users: usersSlice,
  modal: modalReducer,
  errors: errorReducer,
});

const store = configureStore({
  reducer,
});

export default store;
