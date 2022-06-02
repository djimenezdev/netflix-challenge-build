import { createSlice } from "@reduxjs/toolkit";

export const subscriptionSlice = createSlice({
  name: "sub",
  initialState: {
    subRole: null,
    isStatus: null,
    subInfo: [],
    trialCheck: false,
  },
  reducers: {
    getRole: (state, action) => {
      state.subRole = action.payload.role;
    },
    getStatus: (state, action) => {
      state.isStatus = action.payload.status;
    },

    getInfo: (state, action) => {
      state.subInfo = action.payload.info;
    },
    getCheck: (state, action) => {
      state.trialCheck = action.payload.check;
    },
  },
});

export const {
  getRole,
  getStatus,
  getInfo,
  getCheck,
} = subscriptionSlice.actions;

export const getData = (state) => ({
  role: state.sub.subRole,
  packageStatus: state.sub.isStatus,
  subInfoM: state.sub.subInfo,
  check: state.sub.trialCheck,
});

export default subscriptionSlice.reducer;
