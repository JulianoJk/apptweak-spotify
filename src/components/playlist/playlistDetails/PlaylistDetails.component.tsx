import {
  Box,
  Group,
  Image,
  rem,
  Table,
  Text,
  Title,
  Checkbox,
  Button,
  ScrollArea,
  useMantineColorScheme,
  UnstyledButton,
  Center
} from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { RootState } from "../../../store/store";
import { getSinglePlaylist, removeTracksFromPlaylist } from "../../../containers/playlist/slice";
import { RequestStatus } from "../../../types/requests";
import { addTracksToPlaylists } from "../../../containers/tracks/slice";
import TrackSearchSelect from "./TrackSearchSelect.component";
import { notificationAlert } from "../../ui/NotificationAlert";
import TrackTableRow from "../../tracks/TrackTableRow.component";
import { useMediaQuery } from "@mantine/hooks";

const PlaylistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { colorScheme } = useMantineColorScheme();
  const {
    personalPlaylists,
    status: playlistStatus,
    error
  } = useSelector((state: RootState) => state.playlistSlice);
  const { status: trackStatus } = useSelector((state: RootState) => state.spotifyTracks);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authentication.user);
  const playlist = personalPlaylists.find((p) => p.id === id);
  const isDesktop = useMediaQuery("(min-width: 56.25em)");

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [searchSelection, setSearchSelection] = useState<string[]>([]);
  const [wasActionFired, setWasActionFired] = useState(false);
  const [wasRemoveFired, setWasRemoveFired] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "artist" | "album" | "albumReleaseDate" | null>(
    null
  );
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    if (!playlist && id && trackStatus !== RequestStatus.PENDING) {
      dispatch(getSinglePlaylist(id));
    }
  }, [dispatch, id, playlist, trackStatus]);

  const toggleTrack = (trackId: string, index: number) => {
    const trackKey = `${trackId}-${index}`;
    setSelectedTracks((prev) =>
      prev.includes(trackKey) ? prev.filter((key) => key !== trackKey) : [...prev, trackKey]
    );
  };

  const toggleAll = () => {
    if (!playlist) return;
    const allKeys = sortedTracks.map((t, i) => `${t.id}-${i}`);
    setSelectedTracks((prev) => (prev.length === allKeys.length ? [] : allKeys));
  };

  const handleAddTracks = () => {
    if (!id || searchSelection.length === 0) return;
    const uris = searchSelection.map((trackId) => `spotify:track:${trackId}`);
    dispatch(addTracksToPlaylists({ playlistIds: [id], trackUris: uris }));
    setWasActionFired(true);
    setSearchSelection([]);
  };

  const handleRemoveTracks = () => {
    if (!id || selectedTracks.length === 0) return;
    const uris = selectedTracks.map((key) => `spotify:track:${key.split("-")[0]}`);
    dispatch(removeTracksFromPlaylist({ playlistId: id, trackUris: uris }));
    setWasRemoveFired(true);
    setSelectedTracks([]);
  };

  useEffect(() => {
    if (wasActionFired && playlistStatus === RequestStatus.SUCCESS) {
      notificationAlert({
        title: "Track(s) added",
        message: "Track(s) were successfully added to your playlist.",
        iconColor: "green",
        closeAfter: 5000
      });
      setWasActionFired(false);
    }

    if (wasRemoveFired && playlistStatus === RequestStatus.SUCCESS) {
      notificationAlert({
        title: "Track(s) removed",
        message: "Track(s) were successfully removed from your playlist.",
        iconColor: "green",
        closeAfter: 5000
      });
      setWasRemoveFired(false);
    }

    if ((wasActionFired || wasRemoveFired) && playlistStatus === RequestStatus.ERROR) {
      notificationAlert({
        title: "Failed to update playlist",
        message: error || "Something went wrong. Please try again.",
        iconColor: "red",
        closeAfter: 5000
      });
      setWasActionFired(false);
      setWasRemoveFired(false);
    }
  }, [playlistStatus, error, wasActionFired, wasRemoveFired]);

  if (!playlist) return <Text px={isDesktop ? "xl" : "md"}>Playlist not found.</Text>;

  const canEdit = user?.userId === playlist.owner.id || playlist.collaborative === true;

  const sortTracks = (tracks: typeof playlist.tracks) => {
    if (!sortBy) return tracks;
    return [...tracks].sort((a, b) => {
      const aField = a[sortBy].toLowerCase();
      const bField = b[sortBy].toLowerCase();
      return reverseSortDirection ? bField.localeCompare(aField) : aField.localeCompare(bField);
    });
  };

  const sortedTracks = sortTracks(playlist.tracks);

  const setSorting = (field: typeof sortBy) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSelectedTracks([]);
  };

  const SortableTh = ({ label, field }: { label: string; field: typeof sortBy }) => {
    const isSorted = sortBy === field;
    const Icon = isSorted ? (reverseSortDirection ? IconChevronUp : IconChevronDown) : IconSelector;

    return (
      <Table.Th>
        <UnstyledButton onClick={() => setSorting(field)}>
          <Group justify="space-between">
            <Text fw={500} fz="sm">
              {label}
            </Text>
            <Center>
              <Icon size={16} stroke={1.5} />
            </Center>
          </Group>
        </UnstyledButton>
      </Table.Th>
    );
  };

  return (
    <Box px={isDesktop ? "xl" : "md"} py={isDesktop ? "xl" : "md"}>
      <Box
        style={{
          display: isDesktop ? "flex" : undefined,
          gap: 24,
          padding: isDesktop ? "2rem" : undefined,
          marginBottom: isDesktop ? 0 : "lg",
          background: isDesktop
            ? colorScheme === "light"
              ? "linear-gradient(135deg,rgb(137, 217, 242),rgb(55, 135, 165))"
              : "linear-gradient(135deg, #7c55de, #3b1898)"
            : undefined
        }}
      >
        <Image
          src={playlist.image || "https://placehold.co/600x400?text=No+Image"}
          radius="md"
          sx={{
            height: isDesktop ? rem(200) : 180,
            width: isDesktop ? rem(200) : "100%",
            objectFit: "cover"
          }}
        />
        <Box>
          <Title
            order={isDesktop ? 1 : 2}
            size={isDesktop ? 48 : 28}
            fw={900}
            c={isDesktop ? "white" : undefined}
            mt={isDesktop ? undefined : "md"}
          >
            {playlist.name}
          </Title>
          <Text size="sm" mt="xs" c={isDesktop && colorScheme === "dark" ? "gray.4" : undefined}>
            {playlist.description}
          </Text>
          <Text
            size="xs"
            mt="xs"
            c={isDesktop ? (colorScheme === "dark" ? "gray.4" : "white") : "dimmed"}
          >
            {playlist.owner.display_name} • {playlist.tracks.length} tracks
          </Text>
        </Box>
      </Box>

      {canEdit && (
        <Group align="flex-end" mb="md">
          <TrackSearchSelect
            searchSelection={searchSelection}
            setSearchSelection={setSearchSelection}
            playlistTrackIds={playlist.tracks.map((t) => t.id)}
          />
          {searchSelection.length > 0 && (
            <Button
              color="green"
              onClick={handleAddTracks}
              loading={trackStatus === RequestStatus.PENDING}
              size="sm"
            >
              Add {searchSelection.length} Track(s)
            </Button>
          )}
          {selectedTracks.length > 0 && (
            <Button variant="outline" color="red" onClick={handleRemoveTracks} size="sm">
              Remove {selectedTracks.length} Track(s)
            </Button>
          )}
        </Group>
      )}

      {playlist.tracks.length <= 0 ? (
        <Text c="dimmed" size={isDesktop ? "xl" : "md"} ta="center">
          No tracks available in this playlist.
          {canEdit ? " You can add tracks using the search bar above." : ""}
        </Text>
      ) : (
        <ScrollArea>
          <Table verticalSpacing="sm" striped={isDesktop} highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {canEdit && (
                  <Table.Th w={40}>
                    <Checkbox
                      checked={selectedTracks.length === sortedTracks.length}
                      indeterminate={
                        selectedTracks.length > 0 && selectedTracks.length !== sortedTracks.length
                      }
                      onChange={toggleAll}
                    />
                  </Table.Th>
                )}
                <Table.Th>#</Table.Th>
                <SortableTh label="Track" field="name" />
                <SortableTh label="Artist" field="artist" />
                <SortableTh label="Album" field="album" />
                <SortableTh label="Release Date" field="albumReleaseDate" />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedTracks.map((track, index) => {
                const key = `${track.id}-${index}`;
                return (
                  <TrackTableRow
                    key={key}
                    track={track}
                    index={index}
                    isSelected={selectedTracks.includes(key)}
                    onToggle={() => toggleTrack(track.id, index)}
                    showCheckbox={canEdit}
                  />
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </Box>
  );
};

export default PlaylistDetails;
