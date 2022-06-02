import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import subReducer from "../features/subscriptionSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    sub: subReducer,
  },
});
