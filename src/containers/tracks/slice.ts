import { createSlice, createAction } from "@reduxjs/toolkit";
import { ErrorPayload, RequestStatus } from "../../types/requests";

export interface ITrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumImage: string;
  spotifyUrl: string;
}
export interface IRandomPlaylist {
  id: string;
  name: string;
  image: string;
  description?: string;
  spotifyUrl: string;
}

interface TracksState {
  tracks: ITrack[];
  randomPlaylists?: IRandomPlaylist[];
  status: RequestStatus;
  error?: string;
}

const initialState: TracksState = {
  tracks: [],
  randomPlaylists: [],
  status: RequestStatus.IDLE
};

export const fetchTracks = createAction<string>("spotify/fetchTracks");
export const getTracksError = createAction<ErrorPayload>("spotify/setTracksError");
export const getTrackSuccess = createAction<ITrack[]>("spotify/setTrackSuccess");
export const fetchHomePlaylists = createAction("spotify/fetchHomePlaylists");
export const getHomePlaylistsSuccess = createAction<IRandomPlaylist[]>(
  "spotify/setHomePlaylistsSuccess"
);
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
      .addCase(fetchHomePlaylists, (state) => {
        state.status = RequestStatus.PENDING;
      })
      .addCase(getHomePlaylistsSuccess, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.randomPlaylists = action.payload;
      })
      .addCase(getHomePlaylistsError, (state, action) => {
        state.status = RequestStatus.ERROR;
        state.error = action.payload.message;
      });
  }
});

export const { setTracks } = tracksSlice.actions;
export default tracksSlice.reducer;
