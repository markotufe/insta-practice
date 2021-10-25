import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import usersSlice from "../slices/usersSlice";
import modalReducer from "../slices/modalSlice";
import errorReducer from "../slices/errorsSlice";

const combinedReducer = combineReducers({
  user: userReducer,
  users: usersSlice,
  modal: modalReducer,
  errors: errorReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "user/logout") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
