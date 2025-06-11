import { useEffect, useState } from "react";
import {
  Avatar,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  Center
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useParams } from "react-router";
import { fetchTracks } from "../../containers/tracks/slice";
import { RequestStatus } from "../../types/requests";
import LoadingIndicator from "../ui/LoadingIndicator.component";
import ErrorMessage from "../ui/ErrorMessage.component";
import { IconChevronDown, IconChevronUp, IconSelector, IconSearch } from "@tabler/icons-react";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

const TrackList = () => {
  const dispatch = useDispatch();
  const { query } = useParams<{ query: string }>();
  const { tracks, status, error } = useSelector((state: RootState) => state.spotifyTracks);

  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(tracks);
  const [sortBy, setSortBy] = useState<keyof (typeof tracks)[0] | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    if (query && tracks.length === 0) {
      dispatch(fetchTracks(query));
    }
  }, [query]);

  useEffect(() => {
    setSortedData(tracks);
  }, [tracks]);

  if (status === RequestStatus.PENDING) return <LoadingIndicator />;
  if (status === RequestStatus.ERROR)
    return <ErrorMessage message={error || "Something went wrong"} />;

  const setSorting = (field: keyof (typeof tracks)[0]) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    const sorted = [...tracks].sort((a, b) => {
      const aVal = a[field]?.toString().toLowerCase() ?? "";
      const bVal = b[field]?.toString().toLowerCase() ?? "";
      return reversed ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });
    setSortedData(sorted);
  };

  const rows = sortedData.map((track) => (
    <Table.Tr key={track.id}>
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
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search tracks"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={(e) => {
          setSearch(e.currentTarget.value);
          const filtered = tracks.filter(
            (track) =>
              track.name.toLowerCase().includes(e.currentTarget.value.toLowerCase()) ||
              track.artist.toLowerCase().includes(e.currentTarget.value.toLowerCase()) ||
              track.album.toLowerCase().includes(e.currentTarget.value.toLowerCase())
          );
          setSortedData(filtered);
        }}
      />
      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Th
              sorted={sortBy === "name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("name")}
            >
              Track
            </Th>
            <Th
              sorted={sortBy === "album"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("album")}
            >
              Album
            </Th>
            <Th
              sorted={sortBy === "albumReleaseDate"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("albumReleaseDate")}
            >
              Release Date
            </Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};

export default TrackList;
