import axios, { AxiosResponse } from "axios";

import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
  take,
  fork,
  ForkEffect,
  ActionPattern,
  delay
} from "@redux-saga/core/effects";

import { selectAccessToken } from "./selectors";
import {
  getToken,
  getTokenFailed,
  getTokenSuccess,
  getUser,
  getUserFailed,
  getUserSuccess,
  login
} from "./slice";
import {
  accessTokenStorageKey,
  base64encode,
  expiresAtStorageKey,
  generateRandomString,
  REDIRECT_URI,
  refreshTokenStorageKey,
  sha256,
  SPOTIFY_SCOPE,
  storeToken,
  TokenResponse
} from "./utils";
import { SagaIterator } from "redux-saga";

export function takeOne<A extends { type: string }>(
  pattern: ActionPattern<A>,
  saga: (action: A, ...args: any[]) => Generator | SagaIterator,
  ...args: any[]
): ForkEffect {
  return fork(function* () {
    const action: A = yield take(pattern);
    yield fork(saga, action, ...args);
  });
}

function* getUserIdSaga() {
  const accessToken: string = yield select(selectAccessToken);
  if (!accessToken) {
    yield put(getUserFailed({ message: "No access token" }));
    return;
  }
  try {
    const request = () =>
      axios.get<any>("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
    const { data } = yield call(request);

    yield put(getUserSuccess({ userId: data.id, userName: data.display_name }));
  } catch (error: any) {
    yield put(getUserFailed({ message: error.message }));
  }
}

function* loginSaga(): SagaIterator {
  const localStorageAccessToken = localStorage.getItem(accessTokenStorageKey);
  if (localStorageAccessToken) {
    yield put(getTokenSuccess(localStorageAccessToken));
    return;
  }
  const { REACT_APP_SPOTIFY_CLIENT_ID } = process.env;
  if (!REACT_APP_SPOTIFY_CLIENT_ID) {
    throw new Error("Missing Spotify Client ID");
  }
  const scope: string = SPOTIFY_SCOPE.join(",");
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  //  We generate a random string to use as the code verifier. It
  //  is used to verify the code challenge sent to Spotify, and we will need it to get the access token (in getTokenSaga)
  const codeVerifier = generateRandomString(64);
  window.localStorage.setItem("code_verifier", codeVerifier);

  const hashed: ArrayBuffer = yield call(sha256, codeVerifier);
  const codeChallenge = base64encode(hashed);
  const params = {
    response_type: "code",
    client_id: REACT_APP_SPOTIFY_CLIENT_ID,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI
  };
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

function* getTokenSaga(action: ReturnType<typeof getToken>): SagaIterator {
  const code = action.payload;
  const { REACT_APP_SPOTIFY_CLIENT_ID } = process.env;
  const getToken = (): Promise<AxiosResponse<TokenResponse>> => {
    if (!REACT_APP_SPOTIFY_CLIENT_ID) {
      throw new Error("Missing Spotify Client ID");
    }

    // stored before navigating to Spotify
    const codeVerifier = localStorage.getItem("code_verifier");
    if (!codeVerifier) {
      throw new Error("Missing code verifier");
    }

    const url = "https://accounts.spotify.com/api/token";

    return axios.post<TokenResponse>(
      url,
      new URLSearchParams({
        client_id: REACT_APP_SPOTIFY_CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
  };

  try {
    const { data }: AxiosResponse<TokenResponse> = yield call(getToken);

    // Store the access token and refresh token in local storage
    storeToken(data);

    // Remove the code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("code");
    window.history.replaceState({}, "", "?" + urlParams);

    // Remove the code verifier from local storage
    localStorage.removeItem("code_verifier");

    // Store the access token in the Redux store to be used by any request
    yield put(getTokenSuccess(data.access_token));
  } catch (e: string | { response: { data: { error: string } } } | any) {
    yield put(getTokenFailed(typeof e === "string" ? e : e?.response?.data?.error));
    console.error("Error getting token", e.toString());
  }
}

function* refreshToken() {
  const { REACT_APP_SPOTIFY_CLIENT_ID } = process.env;
  const refreshToken = localStorage.getItem(refreshTokenStorageKey) ?? "";
  const refreshTokenCall = () => {
    return axios.post<TokenResponse>(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: REACT_APP_SPOTIFY_CLIENT_ID!
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
  };
  try {
    const { data } = yield call(refreshTokenCall);

    // Store the access token and refresh token in local storage
    storeToken(data);
  } catch (e) {
    console.error("Error refreshing token", e);
  }
}

/**
 * Periodic refresh token saga
 */
function* periodicRefreshToken() {
  while (true) {
    const tokenExpiry = parseInt(localStorage.getItem(expiresAtStorageKey) ?? "0");
    const now = Math.floor(Date.now() / 1000);
    const bufferTime = 60; // 1 minute buffer time
    yield delay(Math.max(0, (tokenExpiry - now - bufferTime) * 1000));
    yield call(refreshToken);
  }
}

export default function* authSaga() {
  yield takeEvery(getUser.type, getUserIdSaga);
  yield takeOne(getToken.type, getTokenSaga);
  yield takeEvery(login.type, loginSaga);
  yield takeLatest(getTokenSuccess.type, periodicRefreshToken);
}
