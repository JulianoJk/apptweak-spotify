import { call, put, select, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import { SagaIterator } from "redux-saga";
import { selectAccessToken } from "../auth/selectors";
import {
  createSpotifyPlaylist,
  createSpotifyPlaylistError,
  createSpotifyPlaylistSuccess,
  getPersonalPlaylists,
  getPersonalPlaylistsError,
  getPersonalPlaylistsSuccess,
  IPersonalPlaylist
} from "../playlist/slice";
import { ITrack } from "../tracks/slice";
import { PayloadAction } from "@reduxjs/toolkit";

function* fetchPersonalWorker(): SagaIterator {
  try {
    const token: string = yield select(selectAccessToken);

    const response = yield call(() =>
      axios.get("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${token}` }
      })
    );

    const playlistSummaries = response.data.items;

    const fullPlaylists: IPersonalPlaylist[] = yield all(
      playlistSummaries.map((playlist: any) =>
        call(function* (): SagaIterator {
          const detailResponse = yield call(() =>
            axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          );

          const full = detailResponse.data;

          const tracks: ITrack[] = full.tracks.items
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
            id: full.id,
            name: full.name,
            image: full.images?.[0]?.url || "",
            description: full.description,
            spotifyUrl: full.external_urls.spotify,
            owner: full.owner,
            tracks
          } as IPersonalPlaylist;
        })
      )
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

    const userResponse = yield call(() =>
      axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
    const userId = userResponse.data.id;

    yield call(() =>
      axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
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

export default function* tracksSaga() {
  yield takeLatest(getPersonalPlaylists.type, fetchPersonalWorker);
  yield takeLatest(createSpotifyPlaylist.type, createSpotifyPlaylistWorker);
}
