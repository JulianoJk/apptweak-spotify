import { useState } from "react";
import { useDispatch } from "react-redux";
import { Box, Button, Card, Group, Input } from "@mantine/core";
import { useStyles } from "./Header.styles";
import ToggleColorMode from "../ui/ToggleColorMode.component";
import { openCreateModal } from "../../containers/playlist/slice";
import PlaylistModal from "../playlist/playlistModal/PlaylistModal.component";
import { useNavigate } from "react-router";
import { fetchTracks } from "../../containers/tracks/slice";
import { IconLibraryPlus, IconSearch } from "@tabler/icons-react";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");

  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchTracks = () => {
    dispatch(fetchTracks(searchValue));
    navigate("/search/tracks/" + searchValue);
  };

  const createPlaylist = () => {
    dispatch(openCreateModal());
  };

  return (
    <>
      <Card radius="md" className={classes.appBar}>
        <Group className={classes.inner} p="apart">
          <Group className={classes.navLinks} gap="md">
            <Button
              variant="subtle"
              component="a"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              Playlists
            </Button>
          </Group>

          <Group className={classes.leftSide} gap="sm">
            <Input
              leftSection={<IconSearch size={26} />}
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
              variant="filled"
              onClick={searchTracks}
              className={classes.searchButton}
              disabled={!searchValue}
            >
              Search
            </Button>
          </Group>

          <Group className={classes.rightSide} gap="sm">
            <Button
              variant="default"
              onClick={createPlaylist}
              className={classes.playlistButton}
              rightSection={<IconLibraryPlus size={16} />}
            >
              Create new playlist
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
