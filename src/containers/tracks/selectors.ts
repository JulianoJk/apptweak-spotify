import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../../store/store";

const selectSelf = (state: RootState) => state.authentication;

export const selectTrackStatus = createSelector(selectSelf, (track) => track.status);
