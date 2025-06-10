import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import ToggleColorMode from "../ui/ToggleColorMode.component";
import { useDispatch } from "react-redux";
import { fetchTracks } from "../../containers/tracks/slice";
import { Button } from "@mui/material";
import { useStyles } from "./Header.styles";
import { openCreateModal } from "../../containers/playlist/slice";
import PlaylistModal from "../playlist/playlistModal/PlaylistModal.component";
import { useNavigate } from "react-router";

interface HeaderProps {
  mode: "light" | "dark";
  setMode: () => void;
}

export default function Header(props: HeaderProps) {
  const [searchValue, setSearchValue] = useState<string>("");

  const { classes } = useStyles();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchTracks = () => {
    dispatch(fetchTracks(searchValue));
    navigate("/search/tracks");
  };
  const createPlaylist = () => {
    dispatch(openCreateModal());
  };

  return (
    <AppBar position="static" elevation={1} className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.navLinks}>
          <Button variant="text" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button variant="text" onClick={() => navigate("/playlists")}>
            Playlists
          </Button>
        </Box>
        <Box className={classes.leftSide}>
          <TextField
            id="search-track"
            label="Search for a track"
            className={classes.textField}
            slotProps={{
              input: {
                style: {
                  borderRadius: "1em"
                }
              }
            }}
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && searchTracks()}
          />
          <Button variant="outlined" className={classes.searchButton} onClick={searchTracks}>
            Search
          </Button>
        </Box>

        <Box className={classes.rightSide}>
          <Button variant="outlined" className={classes.playlistButton} onClick={createPlaylist}>
            Add new playlist
          </Button>
          <Box className={classes.toggleBox}>
            <ToggleColorMode {...props} />
          </Box>
        </Box>
      </Toolbar>
      <PlaylistModal />
    </AppBar>
  );
}
