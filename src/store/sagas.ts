import { all } from "@redux-saga/core/effects";

import authSaga from "../containers/auth/authSagas";
import tracksSaga from "../containers/tracks/trackSagas";
import playListSaga from "../containers/playlist/playlistSaga";

export default function* rootSaga() {
  yield all([authSaga(), tracksSaga(), playListSaga()]);
}
