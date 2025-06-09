import "./App.css";
import { FC, ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { HashRouter as Router, Routes, Route } from "react-router";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { selectUser } from "./containers/auth/selectors";
import Header from "./components/header/Header.component";
import DisplayTracks from "./components/tracks/DisplayTracks.component";
import HomePage from "./components/home/HomePage";

const App: FC = (): ReactElement => {
  const user = useSelector(selectUser);
  // TODO: You can access user data and now fetch user's playlists
  console.log(user);

  const [mode, setMode] = useState<"light" | "dark">("dark");

  const toggleMode = () => setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));

  const theme = createTheme({ palette: { mode } });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header mode={mode} setMode={toggleMode} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/tracks" element={<DisplayTracks />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
