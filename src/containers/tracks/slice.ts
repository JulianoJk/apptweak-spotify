import { createSlice, createAction } from "@reduxjs/toolkit";
import { ErrorPayload, RequestStatus } from "../../types/requests";

export interface ITrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumImage: string;
  spotifyUrl: string;
  albumReleaseDate: string;
}

interface TracksState {
  tracks: ITrack[];
  status: RequestStatus;
  error?: string;
}

const initialState: TracksState = {
  tracks: [],
  status: RequestStatus.IDLE
};

export const fetchTracks = createAction<string>("spotify/fetchTracks");
export const getTracksError = createAction<ErrorPayload>("spotify/setTracksError");
export const getTrackSuccess = createAction<ITrack[]>("spotify/setTrackSuccess");

export const getHomePlaylistsError = createAction<ErrorPayload>("spotify/setHomePlaylistsError");

const tracksSlice = createSlice({
  name: "spotifyTracks",
  initialState,
  reducers: {
    setTracks(state, action) {
      state.tracks = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks, (state) => {
        state.status = RequestStatus.PENDING;
      })
      .addCase(getTrackSuccess, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.tracks = action.payload;
      })
      .addCase(getTracksError, (state, action) => {
        state.status = RequestStatus.ERROR;
        state.error = action.payload.message;
      });
  }
});

export const { setTracks } = tracksSlice.actions;
export default tracksSlice.reducer;
