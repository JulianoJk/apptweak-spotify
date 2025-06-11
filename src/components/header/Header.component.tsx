import { useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, Card, Group, Input } from "@mantine/core";
import { useStyles } from "./Header.styles";
import ToggleColorMode from "../ui/ToggleColorMode.component";
import { openCreateModal } from "../../containers/playlist/slice";
import PlaylistModal from "../playlist/playlistModal/PlaylistModal.component";
import { useNavigate } from "react-router";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");

  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchTracks = () => {
    navigate("/search/tracks/:" + searchValue);
  };

  const createPlaylist = () => {
    dispatch(openCreateModal());
  };

  return (
    <>
      <Card radius="md" className={classes.appBar}>
        <Group className={classes.inner} p="apart">
          <Group className={classes.navLinks} gap="md">
            <Button variant="subtle" onClick={() => navigate("/")}>
              Playlists
            </Button>
          </Group>

          <Group className={classes.leftSide} gap="sm">
            <Input
              id="search-track"
              size="lg"
              radius="lg"
              value={searchValue}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && searchTracks()}
              placeholder="Search for a track"
              className={classes.textField}
            />

            <Button
              variant="default"
              onClick={searchTracks}
              className={classes.searchButton}
              disabled={!searchValue}
            >
              Search
            </Button>
          </Group>

          <Group className={classes.rightSide} gap="sm">
            <Button variant="default" onClick={createPlaylist} className={classes.playlistButton}>
              Add new playlist
            </Button>
            <Box className={classes.toggleBox}>
              <ToggleColorMode />
            </Box>
          </Group>
        </Group>
      </Card>
      <PlaylistModal />
    </>
  );
}
