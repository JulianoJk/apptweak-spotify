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
  useMantineColorScheme
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { RootState } from "../../../store/store";
import { getSinglePlaylist } from "../../../containers/playlist/slice";
import { RequestStatus } from "../../../types/requests";
import { addTracksToPlaylists } from "../../../containers/tracks/slice";
import TrackSearchSelect from "./TrackSearchSelect.component";
import { notificationAlert } from "../../ui/NotificationAlert";
import TrackTableRow from "../../tracks/TrackTableRow.component";

const PlaylistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { status: trackStatus } = useSelector((state: RootState) => state.spotifyTracks);
  const { colorScheme } = useMantineColorScheme();
  const {
    personalPlaylists,
    status: playlistStatus,
    error
  } = useSelector((state: RootState) => state.playlistSlice);

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.authentication.user);

  const playlist = personalPlaylists.find((p) => p.id === id);

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [searchSelection, setSearchSelection] = useState<string[]>([]);

  const [wasActionFired, setWasActionFired] = useState(false);

  useEffect(() => {
    if (!playlist && id && trackStatus !== RequestStatus.PENDING) {
      dispatch(getSinglePlaylist(id));
    }
  }, [dispatch, id, playlist, trackStatus]);

  const toggleTrack = (trackId: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]
    );
  };

  const toggleAll = () => {
    if (!playlist) return;
    if (selectedTracks.length === playlist.tracks.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(playlist.tracks.map((t) => t.id));
    }
  };

  const handleAddTracks = () => {
    if (!id || searchSelection.length === 0) return;

    const uris = searchSelection.map((trackId) => `spotify:track:${trackId}`);

    dispatch(addTracksToPlaylists({ playlistIds: [id], trackUris: uris }));
    dispatch(getSinglePlaylist(id));
    setWasActionFired(true);
    setSearchSelection([]);
  };

  useEffect(() => {
    if (!wasActionFired) return;

    if (playlistStatus === RequestStatus.SUCCESS) {
      notificationAlert({
        title: "Track(s) added",
        message: "Track(s) were successfully added to your playlist.",
        iconColor: "green",
        closeAfter: 5000
      });
      setWasActionFired(false);
    }

    if (playlistStatus === RequestStatus.ERROR) {
      notificationAlert({
        title: "Failed to add track(s)",
        message: error || "Something went wrong. Please try again.",
        iconColor: "red",
        closeAfter: 5000
      });
      setWasActionFired(false);
    }
  }, [playlistStatus, error, wasActionFired]);

  if (!playlist) return <Text px="xl">Playlist not found.</Text>;

  const canEdit = user?.userId === playlist.owner.id || playlist.collaborative === true;

  return (
    <>
      <Box
        style={{
          display: "flex",
          gap: 24,
          padding: "2rem",
          background:
            colorScheme === "light"
              ? "linear-gradient(135deg,rgb(137, 217, 242),rgb(55, 135, 165))"
              : "linear-gradient(135deg, #7c55de, #3b1898)"
        }}
      >
        <Image
          src={playlist.image}
          fallbackSrc="https://placehold.co/600x400?text=No+Image"
          radius="md"
          sx={{ height: rem(200), width: rem(200), objectFit: "cover" }}
        />
        <Box>
          <Title order={1} size={48} fw={900} c="white">
            {playlist.name}
          </Title>
          <Text size="sm" c={colorScheme === "dark" ? "gray.4" : "white"} mt="xs">
            {playlist.description}
          </Text>
          <Text size="sm" c={colorScheme === "dark" ? "gray.4" : "white"} mt="sm">
            {playlist.owner.display_name} &#x2022; {playlist.tracks.length} tracks
          </Text>
        </Box>
      </Box>

      <Box p="md">
        {canEdit && (
          <Group align="flex-end" mb="md">
            <TrackSearchSelect
              searchSelection={searchSelection}
              setSearchSelection={setSearchSelection}
              playlistTrackIds={playlist.tracks.map((t) => t.id)}
            />
            <Button
              onClick={handleAddTracks}
              loading={trackStatus === RequestStatus.PENDING}
              size="sm"
            >
              Add
            </Button>
          </Group>
        )}

        {playlist.tracks.length <= 0 ? (
          <Text c="dimmed" size="xl" ta="center">
            No tracks available in this playlist.
            {canEdit ? " You can add tracks using the search bar above." : ""}
          </Text>
        ) : (
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                {canEdit && (
                  <Table.Th w={40}>
                    <Checkbox
                      checked={selectedTracks.length === playlist.tracks.length}
                      indeterminate={
                        selectedTracks.length > 0 &&
                        selectedTracks.length !== playlist.tracks.length
                      }
                      onChange={toggleAll}
                    />
                  </Table.Th>
                )}
                <Table.Th>#</Table.Th>
                <Table.Th>Track</Table.Th>
                <Table.Th>Album</Table.Th>
                <Table.Th>Release Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {playlist.tracks.map((track, index) => (
                <TrackTableRow
                  key={track.id}
                  track={track}
                  index={index}
                  isSelected={selectedTracks.includes(track.id)}
                  onToggle={toggleTrack}
                  showCheckbox={canEdit}
                />
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Box>
    </>
  );
};

export default PlaylistDetails;
