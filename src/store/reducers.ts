import { combineReducers } from "redux";

import authentication from "../containers/auth/slice";
import spotifyTracks from "../containers/tracks/slice";
import playlistSlice from "../containers/playlist/slice";

const rootReducer = combineReducers({
  authentication,
  spotifyTracks,
  playlistSlice
});

export default rootReducer;
