import { createAction, createSlice } from "@reduxjs/toolkit";

import { ErrorPayload, RequestStatus } from "../../types/requests";

export interface User {
  userId?: string;
  userName?: string;
}

export interface AuthState {
  accessToken?: string;
  user?: User;
  status: RequestStatus;
  error?: string;
}

const initialState: AuthState = {
  status: RequestStatus.IDLE
};

// Create actions
export const getToken = createAction<string>("auth/token");
export const getTokenSuccess = createAction<string>("auth/tokenSuccess");
export const getTokenFailed = createAction<string>("auth/tokenFailed");
export const getUser = createAction("auth/getUser");
export const getUserSuccess = createAction<User>("auth/getUserSuccess");
export const getUserFailed = createAction<ErrorPayload>("auth/getUserFailed");

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    login: () => {} // added to be available for dispatching the Saga
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser, (state) => {
        state.status = RequestStatus.PENDING;
      })
      .addCase(getUserSuccess, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.user = action.payload;
      })
      .addCase(getUserFailed, (state, action) => {
        state.status = RequestStatus.ERROR;
        state.error = action.payload.message;
      })
      .addCase(getToken, (state) => {
        state.status = RequestStatus.PENDING;
      })
      .addCase(getTokenFailed, (state, action) => {
        state.status = RequestStatus.ERROR;
        state.error = action.payload;
      })
      .addCase(getTokenSuccess, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.accessToken = action.payload;
      });
  }
});

export const { setAccessToken, login } = authSlice.actions;

export default authSlice.reducer;
