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
import { useStyles } from "./Header.styles";
import { useNavigate } from "react-router";

interface HeaderProps {
  mode: "light" | "dark";
  setMode: () => void;
}

export default function Header(props: HeaderProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const dispatch = useDispatch();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const searchTracks = () => {
    dispatch(fetchTracks(searchValue));
    navigate("/search/tracks");
  };
  return (
    <AppBar position="static" elevation={1} className={classes.appBar}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" className={classes.title}>
          Spotify Clone
        </Typography>

        <Box className={classes.searchSection}>
          <TextField
            id="standard-basic"
            label="Search for a track"
            className={classes.textField}
            slotProps={{
              input: {
                style: {
                  borderRadius: "3em"
                }
              }
            }}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <Button variant="outlined" className={classes.searchButton} onClick={searchTracks}>
            Search
          </Button>
        </Box>

        <Box className={classes.toggleBox}>
          <ToggleColorMode {...props} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
