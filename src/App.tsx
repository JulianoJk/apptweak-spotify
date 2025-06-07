import "./App.css";
import { FC, ReactElement, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { selectUser } from "./containers/auth/selectors";
import ToggleColorMode from "./components/ui/ToggleColorMode.component";

const App: FC = (): ReactElement => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  // TODO: You can access user data and now fetch user's playlists
  console.log(user);

  const [mode, setMode] = useState<"light" | "dark">("dark");

  const toggleMode = () => setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));

  const theme = createTheme({ palette: { mode } });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToggleColorMode mode={mode} setMode={toggleMode} />
    </ThemeProvider>
  );
};

export default App;
