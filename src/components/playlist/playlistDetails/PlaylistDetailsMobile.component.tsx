import { Box, Group, Image, Text, Title, Checkbox, Button, Table, ScrollArea } from "@mantine/core";
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

const PlaylistDetailsMobile = () => {
  const { id } = useParams<{ id: string }>();
  const { status: trackStatus } = useSelector((state: RootState) => state.spotifyTracks);
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
  const [wasRemoveFired, setWasRemoveFired] = useState(false);

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
    setWasActionFired(true);
    setSearchSelection([]);
  };

  const handleRemoveTracks = () => {
    if (!id || selectedTracks.length === 0) return;
    const uris = selectedTracks.map((trackId) => `spotify:track:${trackId}`);
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

  if (!playlist) return <Text px="md">Playlist not found.</Text>;
  const canEdit = user?.userId === playlist.owner.id || playlist.collaborative === true;

  return (
    <Box px="md" py="md">
      <Box mb="lg">
        <Image
          src={playlist.image || "https://placehold.co/600x400?text=No+Image"}
          radius="md"
          height={180}
          width="100%"
          fit="cover"
        />
        <Title order={2} mt="md" size={28}>
          {playlist.name}
        </Title>
        <Text size="sm" mt="xs">
          {playlist.description}
        </Text>
        <Text size="xs" mt="xs" c="dimmed">
          {playlist.owner.display_name} • {playlist.tracks.length} tracks
        </Text>
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
            <Button
              variant="outline"
              color="red"
              disabled={selectedTracks.length === 0}
              onClick={handleRemoveTracks}
              size="sm"
            >
              Remove {selectedTracks.length} Track(s)
            </Button>
          )}
        </Group>
      )}

      {playlist.tracks.length <= 0 ? (
        <Text c="dimmed" size="md" ta="center">
          No tracks available in this playlist.
          {canEdit ? " You can add tracks using the search bar above." : ""}
        </Text>
      ) : (
        <ScrollArea>
          <Table verticalSpacing="sm" striped highlightOnHover>
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
                  key={`${track.id}-${index}`}
                  track={track}
                  index={index}
                  isSelected={selectedTracks.includes(track.id)}
                  onToggle={toggleTrack}
                  showCheckbox={canEdit}
                />
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </Box>
  );
};

export default PlaylistDetailsMobile;
