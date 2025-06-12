import { combineReducers } from "redux";

import authentication from "../containers/auth/slice";
import spotifyTracks from "../containers/tracks/slice";

const rootReducer = combineReducers({
  authentication,
  spotifyTracks
});

export default rootReducer;
