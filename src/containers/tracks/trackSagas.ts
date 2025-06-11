import { call, put, select, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { SagaIterator } from "redux-saga";
import { fetchTracks, getTracksError, getTrackSuccess, ITrack } from "./slice";
import { selectAccessToken } from "../auth/selectors";
import { PayloadAction } from "@reduxjs/toolkit";

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
          limit: 15
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

    yield put(getTrackSuccess(tracks));
  } catch (error: any) {
    yield put(getTracksError({ message: error.message }));
  }
}
export default function* playListSaga() {
  yield takeLatest(fetchTracks.type, fetchTracksWorker);
}
