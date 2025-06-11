import { call, put, select, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import { SagaIterator } from "redux-saga";
import { selectAccessToken } from "../auth/selectors";
import {
  addTracksToPlaylists,
  createSpotifyPlaylist,
  createSpotifyPlaylistError,
  createSpotifyPlaylistSuccess,
  getPersonalPlaylists,
  getPersonalPlaylistsError,
  getPersonalPlaylistsSuccess,
  getSinglePlaylist,
  getSinglePlaylistSuccess,
  IPersonalPlaylist
} from "../playlist/slice";
import { ITrack } from "../tracks/slice";
import { PayloadAction } from "@reduxjs/toolkit";

function* fetchPlaylistDetails(id: string, token: string): SagaIterator {
  const { data } = yield call(() =>
    axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  );

  const tracks: ITrack[] = data.tracks.items
    .filter((item: any) => item.track)
    .map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists[0]?.name,
      album: item.track.album.name,
      albumImage: item.track.album.images[0]?.url,
      albumReleaseDate: item.track.album.release_date,
      spotifyUrl: item.track.external_urls.spotify
    }));

  return {
    id: data.id,
    name: data.name,
    image: data.images?.[0]?.url || "",
    description: data.description,
    spotifyUrl: data.external_urls.spotify,
    owner: data.owner,
    tracks
  } as IPersonalPlaylist;
}

function* fetchPersonalWorker(): SagaIterator {
  try {
    const token: string = yield select(selectAccessToken);
    const { data } = yield call(() =>
      axios.get("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${token}` }
      })
    );

    const fullPlaylists: IPersonalPlaylist[] = yield all(
      data.items.map((playlist: any) => call(fetchPlaylistDetails, playlist.id, token))
    );

    yield put(getPersonalPlaylistsSuccess(fullPlaylists));
  } catch (error: any) {
    yield put(getPersonalPlaylistsError({ message: error.message }));
  }
}

function* createSpotifyPlaylistWorker(
  action: PayloadAction<{ name: string; description?: string }>
): SagaIterator {
  try {
    const token: string = yield select(selectAccessToken);

    const { data: user } = yield call(() =>
      axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
    );

    yield call(() =>
      axios.post(
        `https://api.spotify.com/v1/users/${user.id}/playlists`,
        {
          name: action.payload.name,
          description: action.payload.description,
          public: false
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )
    );

    yield put(createSpotifyPlaylistSuccess());
    yield put(getPersonalPlaylists());
  } catch (error: any) {
    yield put(createSpotifyPlaylistError({ message: error.message }));
  }
}
function* addTracksToPlaylistsWorker(
  action: PayloadAction<{ playlistIds: string[]; trackUris: string[] }>
): SagaIterator {
  try {
    const token: string = yield select(selectAccessToken);

    for (const playlistId of action.payload.playlistIds) {
      yield call(() =>
        axios.post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            uris: action.payload.trackUris
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        )
      );
    }

    yield put(getPersonalPlaylists());
  } catch (error: any) {
    // TODO!: Handle error
    console.error("Error adding tracks:", error.message);
  }
}

function* fetchSinglePlaylistWorker(action: PayloadAction<string>): SagaIterator {
  try {
    const token: string = yield select(selectAccessToken);
    const playlist = yield call(fetchPlaylistDetails, action.payload, token);
    yield put(getSinglePlaylistSuccess(playlist));
  } catch (error: any) {
    yield put(getPersonalPlaylistsError({ message: error.message }));
  }
}

export default function* playlistSaga() {
  yield takeLatest(getPersonalPlaylists.type, fetchPersonalWorker);
  yield takeLatest(createSpotifyPlaylist.type, createSpotifyPlaylistWorker);
  yield takeLatest(getSinglePlaylist.type, fetchSinglePlaylistWorker);
  yield takeLatest(addTracksToPlaylists.type, addTracksToPlaylistsWorker);
}
