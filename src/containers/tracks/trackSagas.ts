import { call, put, takeEvery, select, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { SagaIterator } from "redux-saga";
import { fetchTracks, getTracksError, getTrackSuccess, ITrack } from "./slice";
import { selectAccessToken } from "../auth/selectors";
import { PayloadAction } from "@reduxjs/toolkit";
import { getRandomPlaylists } from "../playlist/slice";

function* fetchTracksWorker(action: PayloadAction<string>): SagaIterator {
  try {
    const query = action.payload;

    const token = yield select(selectAccessToken);

    const response = yield call(() =>
      axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: query,
          type: "track",
          limit: 10
        }
      })
    );

    const tracks = response.data.tracks.items.map(
      (track: any): ITrack => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name,
        album: track.album.name,
        albumImage: track.album.images[0]?.url,
        albumReleaseDate: track.album.release_date,
        spotifyUrl: track.external_urls.spotify
      })
    );
    fetchRandomWorker();

    yield put(getTrackSuccess(tracks));
  } catch (error: any) {
    yield put(getTracksError({ message: error.message }));
  }
}
function* fetchRandomWorker(): SagaIterator {
  try {
    const token = yield select(selectAccessToken);

    const response = yield call(() =>
      axios.get("https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    );

    console.log("response", response.data);
  } catch (error: any) {
    yield put(getTracksError({ message: error.message }));
  }
}

export default function* playListSaga() {
  yield takeEvery(fetchTracks.type, fetchTracksWorker);
  yield takeLatest(getRandomPlaylists.type, fetchRandomWorker);
}
