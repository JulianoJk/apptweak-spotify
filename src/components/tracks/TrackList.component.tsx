import { useEffect, useState } from "react";
import {
  Avatar,
  Checkbox,
  Group,
  ScrollArea,
  Table,
  Text,
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
import { IconPlaylistAdd } from "@tabler/icons-react";
import TrackToPlaylist from "../playlist/trackToPlaylistModal/TrackToPlaylistModal.component";
import { openPlaylistSelectModal } from "../../containers/playlist/slice";

const TrackList = () => {
  const dispatch = useDispatch();
  const { query } = useParams<{ query: string }>();
  const { tracks, status, error } = useSelector((state: RootState) => state.spotifyTracks);

  const [sortedData, setSortedData] = useState(tracks);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  useEffect(() => {
    if (query && tracks.length === 0 && status === RequestStatus.IDLE) {
      dispatch(fetchTracks(query));
    }
  }, [dispatch, query, tracks.length, status]);

  useEffect(() => {
    setSortedData(tracks);
  }, [tracks]);

  const toggleRow = (id: string) =>
    setSelectedTracks((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const toggleAll = () =>
    setSelectedTracks((current) =>
      current.length === tracks.length ? [] : tracks.map((t) => t.id)
    );

  const handleOpenPlaylistModal = () => {
    dispatch(openPlaylistSelectModal());
  };

  if (status === RequestStatus.PENDING) return <LoadingIndicator />;
  if (status === RequestStatus.ERROR)
    return <ErrorMessage message={error || "Something went wrong"} />;

  const rows = sortedData.map((track) => {
    const selected = selectedTracks.includes(track.id);
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
      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}>
              <Checkbox
                onChange={toggleAll}
                checked={selectedTracks.length === tracks.length}
                indeterminate={selectedTracks.length > 0 && selectedTracks.length !== tracks.length}
              />
            </Table.Th>
            <Table.Th>Track</Table.Th>
            <Table.Th>Album</Table.Th>
            <Table.Th>Release Date</Table.Th>
            <Table.Th w={60}>
              {selectedTracks.length > 0 ? (
                <Tooltip label="Add selected to playlist" withArrow>
                  <ActionIcon
                    variant="filled"
                    onClick={handleOpenPlaylistModal}
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
      <TrackToPlaylist selectedTrackIds={selectedTracks} />
    </ScrollArea>
  );
};

export default TrackList;
