import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../../store/store";

const selectSelf = (state: RootState) => state.authentication;

export const selectAccessToken = createSelector(selectSelf, (auth) => auth.accessToken);
export const selectUser = createSelector(selectSelf, (auth) => auth.user);
export const selectAuthStatus = createSelector(selectSelf, (auth) => auth.status);
