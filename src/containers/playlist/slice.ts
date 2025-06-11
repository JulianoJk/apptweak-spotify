import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITrack } from "../tracks/slice";
import { ErrorPayload, RequestStatus } from "../../types/requests";

export interface IUserPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: ITrack[];
}
export interface IPersonalPlaylist {
  id: string;
  name: string;
  image: string;
  description?: string;
  spotifyUrl: string;
  owner: { display_name: string };
  tracks: ITrack[];
}
interface PlaylistState {
  playlists: IUserPlaylist[];
  personalPlaylists: IPersonalPlaylist[];
  selectedPlaylistId?: string;
  isModalOpen: boolean;
  playlistSelectorModal: boolean;
  status: RequestStatus;
  error?: string;
}

const initialState: PlaylistState = {
  playlists: [],
  personalPlaylists: [],
  selectedPlaylistId: undefined,
  isModalOpen: false,
  playlistSelectorModal: false,
  status: RequestStatus.IDLE
};
export const getPersonalPlaylists = createAction("spotify/fetchpersonalPlaylists");
export const getPersonalPlaylistsSuccess = createAction<IPersonalPlaylist[]>(
  "spotify/fetchpersonalPlaylistsSuccess"
);
export const getPersonalPlaylistsError = createAction<ErrorPayload>(
  "spotify/fetchpersonalPlaylistsError"
);

export const createSpotifyPlaylist = createAction<{ name: string; description?: string }>(
  "spotify/createSpotifyPlaylist"
);
export const createSpotifyPlaylistSuccess = createAction("spotify/createSpotifyPlaylistSuccess");
export const createSpotifyPlaylistError = createAction<ErrorPayload>(
  "spotify/createSpotifyPlaylistError"
);
export const getSinglePlaylist = createAction<string>("spotify/fetchSinglePlaylist");
export const getSinglePlaylistSuccess = createAction<IPersonalPlaylist>(
  "spotify/fetchSinglePlaylistSuccess"
);
export const addTracksToPlaylists = createAction<{
  playlistIds: string[];
  trackUris: string[];
}>("spotify/addTracksToPlaylists");

const playlistSlice = createSlice({
  name: "userPlaylists",
  initialState,
  reducers: {
    createPlaylist(state, action: PayloadAction<{ name: string; description?: string }>) {
      const newPlaylist: IUserPlaylist = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        description: action.payload.description,
        tracks: []
      };
      state.playlists.push(newPlaylist);
    },
    updatePlaylistDetails(
      state,
      action: PayloadAction<{ id: string; name?: string; description?: string }>
    ) {
      const { id, name, description } = action.payload;
      const playlist = state.playlists.find((p) => p.id === id);
      if (playlist) {
        if (name) playlist.name = name;
        if (description) playlist.description = description;
      }
    },
    selectPlaylist(state, action: PayloadAction<string>) {
      state.selectedPlaylistId = action.payload;
    },
    addTrackToPlaylist(state, action: PayloadAction<{ playlistId: string; track: ITrack }>) {
      const playlist = state.playlists.find((p) => p.id === action.payload.playlistId);
      if (playlist && !playlist.tracks.find((t) => t.id === action.payload.track.id)) {
        playlist.tracks.push(action.payload.track);
      }
    },
    removeTrackFromPlaylist(state, action: PayloadAction<{ playlistId: string; trackId: string }>) {
      const playlist = state.playlists.find((p) => p.id === action.payload.playlistId);
      if (playlist) {
        playlist.tracks = playlist.tracks.filter((t) => t.id !== action.payload.trackId);
      }
    },
    openCreateModal(state) {
      state.isModalOpen = true;
    },
    closeCreateModal(state) {
      state.isModalOpen = false;
    },
    openPlaylistSelectModal(state) {
      state.playlistSelectorModal = true;
    },
    closePlaylistSelectModal(state) {
      state.playlistSelectorModal = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPersonalPlaylists, (state) => {
        state.status = RequestStatus.PENDING;
      })
      .addCase(getPersonalPlaylistsSuccess, (state, action) => {
        state.status = RequestStatus.SUCCESS;
        state.personalPlaylists = action.payload;
      })
      .addCase(getPersonalPlaylistsError, (state, action) => {
        state.status = RequestStatus.ERROR;
        state.error = action.payload.message;
      })
      .addCase(createSpotifyPlaylistSuccess, (state) => {
        state.status = RequestStatus.SUCCESS;
      })
      .addCase(createSpotifyPlaylistError, (state, action) => {
        state.status = RequestStatus.ERROR;
        state.error = action.payload.message;
      })
      .addCase(getSinglePlaylistSuccess, (state, action) => {
        const exists = state.personalPlaylists.find((p) => p.id === action.payload.id);
        if (!exists) {
          state.personalPlaylists.push(action.payload);
        }
      });
  }
});

export const {
  createPlaylist,
  updatePlaylistDetails,
  selectPlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  openCreateModal,
  closeCreateModal,
  openPlaylistSelectModal,
  closePlaylistSelectModal
} = playlistSlice.actions;

export default playlistSlice.reducer;
