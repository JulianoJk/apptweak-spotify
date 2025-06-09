import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import ToggleColorMode from "../ui/ToggleColorMode.component";
import { useDispatch } from "react-redux";
import { fetchTracks } from "../../containers/tracks/slice";
import { Button } from "@mui/material";

interface HeaderProps {
  mode: "light" | "dark";
  setMode: () => void;
}

export default function Header(props: HeaderProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const dispatch = useDispatch();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap sx={{ flexShrink: 0 }}>
          Spotify Clone
        </Typography>

        <Box sx={{ flexGrow: 1, mx: 4 }}>
          <TextField
            id="standard-basic"
            label="Search for a track"
            variant="standard"
            onChange={(event) => setSearchValue(event.target.value)}
            sx={{ borderRadius: 1, width: "100%" }}
          />
          <Button onClick={() => dispatch(fetchTracks(searchValue))}>Search</Button>
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <ToggleColorMode {...props} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
