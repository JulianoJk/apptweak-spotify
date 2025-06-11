import { useEffect, useState } from "react";
import {
  Avatar,
  Checkbox,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  Tooltip,
  ActionIcon
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useParams } from "react-router";
import { fetchTracks } from "../../containers/tracks/slice";
import { RequestStatus } from "../../types/requests";
import LoadingIndicator from "../ui/LoadingIndicator.component";
import ErrorMessage from "../ui/ErrorMessage.component";
import { IconPlaylistAdd, IconSearch } from "@tabler/icons-react";

const TrackList = () => {
  const dispatch = useDispatch();
  const { query } = useParams<{ query: string }>();
  const { tracks, status, error } = useSelector((state: RootState) => state.spotifyTracks);

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(tracks);
  const [selection, setSelection] = useState<string[]>([]);

  useEffect(() => {
    if (query && tracks.length === 0 && status === RequestStatus.IDLE) {
      dispatch(fetchTracks(query));
    }
  }, [dispatch, query, tracks.length, status]);

  useEffect(() => {
    setSortedData(tracks);
  }, [tracks]);

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const toggleAll = () =>
    setSelection((current) => (current.length === tracks.length ? [] : tracks.map((t) => t.id)));

  if (status === RequestStatus.PENDING) return <LoadingIndicator />;
  if (status === RequestStatus.ERROR)
    return <ErrorMessage message={error || "Something went wrong"} />;

  const rows = sortedData.map((track) => {
    const selected = selection.includes(track.id);
    return (
      <Table.Tr key={track.id} style={{ backgroundColor: selected ? "#2c2e33" : "inherit" }}>
        <Table.Td>
          <Checkbox checked={selected} onChange={() => toggleRow(track.id)} />
        </Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Avatar size={76} src={track.albumImage} radius="sm" />
            <div>
              <Text size="sm" fw={500}>
                {track.name}
              </Text>
              <Text size="xs" c="dimmed">
                {track.artist}
              </Text>
            </div>
          </Group>
        </Table.Td>
        <Table.Td>{track.album}</Table.Td>
        <Table.Td>{track.albumReleaseDate}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search tracks"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={(e) => {
          const value = e.currentTarget.value;
          setSearch(value);
          const filtered = tracks.filter(
            (track) =>
              track.name.toLowerCase().includes(value.toLowerCase()) ||
              track.artist.toLowerCase().includes(value.toLowerCase()) ||
              track.album.toLowerCase().includes(value.toLowerCase())
          );
          setSortedData(filtered);
        }}
      />

      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === tracks.length}
                indeterminate={selection.length > 0 && selection.length !== tracks.length}
              />
            </Table.Th>
            <Table.Th>Track</Table.Th>
            <Table.Th>Album</Table.Th>
            <Table.Th>Release Date</Table.Th>
            <Table.Th w={60}>
              {selection.length > 0 ? (
                <Tooltip label="Add selected to playlist" withArrow>
                  <ActionIcon
                    variant="filled"
                    onClick={() => console.log("Add selected tracks to playlist", selection)}
                    color="blue"
                    aria-label="Add to Playlist"
                  >
                    <IconPlaylistAdd style={{ width: "70%", height: "70%" }} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              ) : null}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};

export default TrackList;
