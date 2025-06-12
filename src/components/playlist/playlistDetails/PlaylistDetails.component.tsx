import {
  Avatar,
  Box,
  Group,
  Image,
  rem,
  Table,
  Text,
  Title,
  Checkbox,
  Button
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { RootState } from "../../../store/store";
import { getSinglePlaylist } from "../../../containers/playlist/slice";
import { RequestStatus } from "../../../types/requests";
import { addTracksToPlaylists } from "../../../containers/tracks/slice";
import TrackSearchSelect from "./TrackSearchSelect.component";

const PlaylistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { personalPlaylists } = useSelector((state: RootState) => state.playlistSlice);
  const { status } = useSelector((state: RootState) => state.spotifyTracks);
  const playlist = personalPlaylists.find((p) => p.id === id);

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [searchSelection, setSearchSelection] = useState<string[]>([]);

  useEffect(() => {
    if (!playlist && id && status !== RequestStatus.PENDING) {
      dispatch(getSinglePlaylist(id));
    }
  }, [dispatch, id, playlist, status]);

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
    setSearchSelection([]);
  };

  if (!playlist) return <Text px="xl">Playlist not found.</Text>;

  return (
    <>
      <Box
        style={{
          display: "flex",
          gap: 24,
          padding: "2rem",
          background: "linear-gradient(135deg, #7c55de, #3b1898)"
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
          <Text size="sm" c="gray.4" mt="xs">
            {playlist.description}
          </Text>
          <Text size="sm" c="gray.4" mt="sm">
            {playlist.owner.display_name} &#x2022; {playlist.tracks.length} tracks
          </Text>
        </Box>
      </Box>

      <Box p="md">
        <Group align="flex-end" mb="md">
          <TrackSearchSelect
            searchSelection={searchSelection}
            setSearchSelection={setSearchSelection}
            playlistTrackIds={playlist.tracks.map((t) => t.id)}
          />

          <Button onClick={handleAddTracks} loading={status === RequestStatus.PENDING} size="sm">
            Add
          </Button>
        </Group>
        {playlist.tracks.length <= 0 ? (
          <Text c="dimmed" size="xl" ta="center">
            No tracks available in this playlist. You can add tracks using the search bar above.
          </Text>
        ) : (
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={40}>
                  <Checkbox
                    checked={selectedTracks.length === playlist.tracks.length}
                    indeterminate={
                      selectedTracks.length > 0 && selectedTracks.length !== playlist.tracks.length
                    }
                    onChange={toggleAll}
                  />
                </Table.Th>
                <Table.Th>#</Table.Th>
                <Table.Th>Track</Table.Th>
                <Table.Th>Album</Table.Th>
                <Table.Th>Release Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {playlist.tracks.map((track, index) => (
                <Table.Tr key={`${track.id}-${index}`}>
                  <Table.Td>
                    <Checkbox
                      checked={selectedTracks.includes(track.id)}
                      onChange={() => toggleTrack(track.id)}
                    />
                  </Table.Td>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>
                    <Group>
                      <Avatar src={track.albumImage} size={60} radius="sm" />
                      <div>
                        <Text fw={500}>{track.name}</Text>
                        <Text size="xs" c="dimmed">
                          {track.artist}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>{track.album}</Table.Td>
                  <Table.Td>{track.albumReleaseDate}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Box>
    </>
  );
};

export default PlaylistDetails;
