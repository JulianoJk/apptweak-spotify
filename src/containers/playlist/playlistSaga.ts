import { call, put, select, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import { SagaIterator } from "redux-saga";
import { selectAccessToken } from "../auth/selectors";
import {
  getRandomPlaylists,
  getRandomPlaylistsError,
  getRandomPlaylistsSuccess,
  IRandomPlaylist
} from "../playlist/slice";
import { ITrack } from "../tracks/slice";

// Helper to fetch full playlist by ID (to get tracks)
function* fetchPlaylistById(id: string, token: string): SagaIterator {
  const response = yield call(() =>
    axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  );
  const playlist = response.data;

  const tracks: ITrack[] = playlist.tracks.items
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
    id: playlist.id,
    name: playlist.name,
    image: playlist.images?.[0]?.url || "",
    description: playlist.description,
    spotifyUrl: playlist.external_urls.spotify,
    tracks
  } as IRandomPlaylist;
}

function* fetchRandomWorker(): SagaIterator {
  try {
    const token: string = yield select(selectAccessToken);

    // Fetch the user's playlists (basic info only)
    const response = yield call(() =>
      axios.get("https://api.spotify.com/v1/me/playlists?limit=20", {
        headers: { Authorization: `Bearer ${token}` }
      })
    );

    const playlistSummaries = response.data.items;

    // Fetch each playlist's full detail (including tracks)
    const fullPlaylists: IRandomPlaylist[] = yield all(
      playlistSummaries.map((playlist: any) => call(fetchPlaylistById, playlist.id, token))
    );

    yield put(getRandomPlaylistsSuccess(fullPlaylists));
  } catch (error: any) {
    yield put(getRandomPlaylistsError({ message: error.message }));
  }
}

export default function* tracksSaga() {
  yield takeLatest(getRandomPlaylists.type, fetchRandomWorker);
}
