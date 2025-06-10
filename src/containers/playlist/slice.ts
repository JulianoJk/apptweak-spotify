import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITrack } from "../tracks/slice";

export interface IUserPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: ITrack[];
}

interface PlaylistState {
  playlists: IUserPlaylist[];
  selectedPlaylistId?: string;
  isModalOpen: boolean;
}

const initialState: PlaylistState = {
  playlists: [],
  selectedPlaylistId: undefined,
  isModalOpen: false
};

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
    }
  }
});

export const {
  createPlaylist,
  updatePlaylistDetails,
  selectPlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  openCreateModal,
  closeCreateModal
} = playlistSlice.actions;

export default playlistSlice.reducer;
