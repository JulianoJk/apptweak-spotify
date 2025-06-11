import { Avatar, Box, Group, Image, rem, ScrollArea, Table, Text, Title } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useEffect } from "react";
import { RootState } from "../../../store/store";
import { getSinglePlaylist } from "../../../containers/playlist/slice";
import { RequestStatus } from "../../../types/requests";

const PlaylistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { personalPlaylists, status } = useSelector((state: RootState) => state.playlistSlice);

  const playlist = personalPlaylists.find((p) => p.id === id);

  useEffect(() => {
    if (!playlist && id && status !== RequestStatus.PENDING) {
      dispatch(getSinglePlaylist(id));
    }
  }, [dispatch, id, playlist, status]);

  if (!playlist) return <Text px="xl">Playlist not found.</Text>;

  return (
    <ScrollArea>
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
          sx={{
            height: rem(200),
            width: rem(200),
            objectFit: "cover"
          }}
        />
        <Box>
          <Text size="xs" c="gray.4">
            Public Playlist
          </Text>
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
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Track</Table.Th>
              <Table.Th>Album</Table.Th>
              <Table.Th>Release Date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {playlist.tracks.map((track) => (
              <Table.Tr key={track.id}>
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
      </Box>
    </ScrollArea>
  );
};

export default PlaylistDetails;
