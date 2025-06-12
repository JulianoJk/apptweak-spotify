import "./App.css";
import { FC, ReactElement } from "react";
import { useSelector } from "react-redux";
import "@mantine/core/styles.css";
import { AppShell, MantineProvider } from "@mantine/core";
import { MantineEmotionProvider, emotionTransform } from "@mantine/emotion";
import { selectUser } from "./containers/auth/selectors";
import Header from "./components/header/Header.component";
import { Route, Routes, BrowserRouter as Router } from "react-router";
import PlaylistList from "./components/playlist/playlistList/PlaylistList.component";
import TrackList from "./components/tracks/TrackList.component";
import PlaylistDetails from "./components/playlist/playlistDetails/PlaylistDetails.component";
import { Notifications } from "@mantine/notifications";

const App: FC = (): ReactElement => {
  const user = useSelector(selectUser);
  // TODO: You can access user data and now fetch user's playlists
  console.log(user);

  return (
    <Router>
      <MantineProvider stylesTransform={emotionTransform} defaultColorScheme="dark">
        <MantineEmotionProvider>
          <Notifications />

          <AppShell padding="md">
            <AppShell.Header>
              <Header />
            </AppShell.Header>
            <AppShell.Main style={{ marginTop: "6rem" }}>
              <Routes>
                <Route path="/" element={<PlaylistList />} />
                <Route path="/playlists" element={<PlaylistList />} />
                <Route path="/playlist/:id" element={<PlaylistDetails />} />
                <Route path="/search/tracks/:query" element={<TrackList />} />
                <Route path="/*" element={<h1>test route</h1>} />
              </Routes>
            </AppShell.Main>
          </AppShell>
        </MantineEmotionProvider>
      </MantineProvider>
    </Router>
  );
};

export default App;
