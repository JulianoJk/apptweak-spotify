import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  Group,
  Input,
  Drawer,
  Burger,
  Stack,
  ScrollArea,
  Divider,
  CloseButton
} from "@mantine/core";
import { useStyles } from "./Header.styles";
import ToggleColorMode from "../ui/ToggleColorMode.component";
import { openCreateModal } from "../../containers/playlist/slice";
import PlaylistModal from "../playlist/playlistModal/PlaylistModal.component";
import { useNavigate } from "react-router";
import { fetchTracks } from "../../containers/tracks/slice";
import { IconLibraryPlus, IconSearch } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [drawerOpened, setDrawerOpened] = useState(false);

  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const matches = useMediaQuery("(min-width: 56.25em)");

  const searchTracks = () => {
    if (!searchValue.trim()) return;
    dispatch(fetchTracks(searchValue));
    navigate("/search/tracks/" + searchValue);
    setSearchValue("");
    setDrawerOpened(false);
  };

  const createPlaylist = () => {
    dispatch(openCreateModal());
    setDrawerOpened(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpened(false);
  };

  return (
    <>
      <Card radius="md" className={classes.appBar}>
        <Group className={classes.inner} p="apart">
          <Burger
            opened={drawerOpened}
            onClick={() => setDrawerOpened((o) => !o)}
            hiddenFrom="sm"
          />

          <Group className={classes.leftSide} gap="xs" flex={1} justify="center">
            <Input
              leftSection={<IconSearch size={20} />}
              id="search-track"
              size={matches ? "lg" : "sm"}
              radius={matches ? "md" : "lg"}
              value={searchValue}
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && searchTracks()}
              placeholder="Search for a track"
              className={classes.textField}
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setSearchValue("")}
                  style={{ display: searchValue ? undefined : "none" }}
                />
              }
              sx={matches ? { flex: 1, maxWidth: "30em" } : {}}
            />
            {matches && (
              <Button
                onClick={searchTracks}
                disabled={!searchValue.trim()}
                size="xs"
                className={classes.searchButton}
              >
                Search
              </Button>
            )}
          </Group>

          <Group className={classes.rightSide} gap="sm" visibleFrom="sm">
            <Button
              variant="subtle"
              component="a"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              Playlists
            </Button>
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

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title={
          <Box display="flex" w="100%">
            <ToggleColorMode />
          </Box>
        }
        padding="md"
        size="100%"
        position="right"
        hiddenFrom="sm"
        zIndex={9999}
      >
        <ScrollArea h={`calc(100vh - 60px)`}>
          <Stack gap="md" px="md">
            <Divider my="xs" label="Navigation" labelPosition="center" />
            <Button variant="subtle" onClick={() => handleNavigate("/")}>
              Playlists
            </Button>
            <Divider my="xs" label="Actions" labelPosition="center" />
            <Button onClick={createPlaylist} rightSection={<IconLibraryPlus size={16} />}>
              Create new playlist
            </Button>
          </Stack>
        </ScrollArea>
      </Drawer>

      <PlaylistModal />
    </>
  );
}
