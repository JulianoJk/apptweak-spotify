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
  Center,
  Modal,
  TextInput,
  Textarea
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { IconChevronDown, IconChevronUp, IconPencil, IconSelector } from "@tabler/icons-react";

import { RootState } from "../../../store/store";
import {
  getSinglePlaylist,
  removeTracksFromPlaylist,
  updatePlaylist
} from "../../../containers/playlist/slice";
import { addTracksToPlaylists } from "../../../containers/tracks/slice";
import { RequestStatus } from "../../../types/requests";
import TrackSearchSelect from "./TrackSearchSelect.component";
import TrackTableRow from "../../tracks/TrackTableRow.component";
import { notificationAlert } from "../../ui/NotificationAlert";

const PlaylistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { colorScheme } = useMantineColorScheme();
  const isDesktop = useMediaQuery("(min-width: 56.25em)");

  const {
    personalPlaylists,
    status: playlistStatus,
    error
  } = useSelector((state: RootState) => state.playlistSlice);
  const { status: trackStatus } = useSelector((state: RootState) => state.spotifyTracks);
  const user = useSelector((state: RootState) => state.authentication.user);

  const playlist = personalPlaylists.find((p) => p.id === id);
  const canEdit = user?.userId === playlist?.owner.id || playlist?.collaborative;
  const [selected, setSelected] = useState<string[]>([]);
  const [searchSelection, setSearchSelection] = useState<string[]>([]);
  const [actionFired, setActionFired] = useState(false);
  const [removeFired, setRemoveFired] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "artist" | "album" | "albumReleaseDate" | null>(
    null
  );
  const [reverseSort, setReverseSort] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (!playlist && id && trackStatus !== RequestStatus.PENDING) {
      dispatch(getSinglePlaylist(id));
    }
  }, [dispatch, id, playlist, trackStatus]);

  useEffect(() => {
    if (playlist) {
      setEditName(playlist.name);
      setEditDescription(playlist.description || "");
    }
  }, [playlist]);

  useEffect(() => {
    if ((actionFired || removeFired) && playlistStatus === RequestStatus.SUCCESS) {
      notificationAlert({
        title: removeFired ? "Track(s) removed" : "Track(s) added",
        message: "Track(s) were successfully updated.",
        iconColor: "green",
        closeAfter: 5000
      });
      setActionFired(false);
      setRemoveFired(false);
    } else if ((actionFired || removeFired) && playlistStatus === RequestStatus.ERROR) {
      notificationAlert({
        title: "Failed to update playlist",
        message: error || "Something went wrong. Please try again.",
        iconColor: "red",
        closeAfter: 5000
      });
      setActionFired(false);
      setRemoveFired(false);
    }
  }, [playlistStatus, actionFired, removeFired, error]);

  if (!playlist) return <Text px={isDesktop ? "xl" : "md"}>Playlist not found.</Text>;

  const getTrackKey = (id: string, index: number) => `${id}-${index}`;
  const sortedTracks = sortBy
    ? [...playlist.tracks].sort((a, b) =>
        reverseSort ? b[sortBy].localeCompare(a[sortBy]) : a[sortBy].localeCompare(b[sortBy])
      )
    : playlist.tracks;

  const toggleTrack = (id: string, index: number) => {
    const key = getTrackKey(id, index);
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const toggleAll = () => {
    const all = sortedTracks.map((t, i) => getTrackKey(t.id, i));
    setSelected((prev) => (prev.length === all.length ? [] : all));
  };

  const setSorting = (field: typeof sortBy) => {
    const reversed = field === sortBy ? !reverseSort : false;
    setSortBy(field);
    setReverseSort(reversed);
    setSelected([]);
  };

  const handleAddTracks = () => {
    if (!id || !searchSelection.length) return;
    dispatch(
      addTracksToPlaylists({
        playlistIds: [id],
        trackUris: searchSelection.map((t) => `spotify:track:${t}`)
      })
    );
    setActionFired(true);
    setSearchSelection([]);
  };

  const handleRemoveTracks = () => {
    if (!id || !selected.length) return;
    dispatch(
      removeTracksFromPlaylist({
        playlistId: id,
        trackUris: selected.map((key) => `spotify:track:${key.split("-")[0]}`)
      })
    );
    setRemoveFired(true);
    setSelected([]);
  };

  const handleSaveEdit = () => {
    if (!id || !editName.trim()) return;
    dispatch(
      updatePlaylist({
        id,
        data: { name: editName.trim(), description: editDescription.trim() }
      })
    );
    notificationAlert({
      title: "Playlist update submitted",
      message: "Changes may take a few seconds to appear due to Spotify caching.",
      iconColor: "blue",
      closeAfter: 5000
    });
    setEditOpen(false);
  };

  const SortableTh = ({ label, field }: { label: string; field: typeof sortBy }) => {
    const active = sortBy === field;
    const Icon = active ? (reverseSort ? IconChevronUp : IconChevronDown) : IconSelector;

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
        {canEdit && (
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconPencil size={16} />}
            onClick={() => setEditOpen(true)}
          >
            Edit
          </Button>
        )}
      </Box>

      {canEdit && (
        <Group align="flex-end" mb="md">
          <TrackSearchSelect
            searchSelection={searchSelection}
            setSearchSelection={setSearchSelection}
            playlistTrackIds={playlist.tracks.map((t) => t.id)}
          />
          {!!searchSelection.length && (
            <Button
              color="green"
              onClick={handleAddTracks}
              loading={trackStatus === RequestStatus.PENDING}
              size="sm"
            >
              Add {searchSelection.length} Track(s)
            </Button>
          )}
          {!!selected.length && (
            <Button variant="outline" color="red" onClick={handleRemoveTracks} size="sm">
              Remove {selected.length} Track(s)
            </Button>
          )}
        </Group>
      )}

      {!playlist.tracks.length ? (
        <Text c="dimmed" size={isDesktop ? "xl" : "md"} ta="center">
          No tracks available in this playlist.
          {canEdit && " You can add tracks using the search bar above."}
        </Text>
      ) : (
        <ScrollArea>
          <Table verticalSpacing="sm" striped={isDesktop} highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {canEdit && (
                  <Table.Th w={40}>
                    <Checkbox
                      checked={selected.length === sortedTracks.length}
                      indeterminate={!!selected.length && selected.length !== sortedTracks.length}
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
              {sortedTracks.map((track, i) => {
                const key = getTrackKey(track.id, i);
                return (
                  <TrackTableRow
                    key={key}
                    track={track}
                    index={i}
                    isSelected={selected.includes(key)}
                    onToggle={() => toggleTrack(track.id, i)}
                    showCheckbox={canEdit}
                  />
                );
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}

      <Modal opened={editOpen} onClose={() => setEditOpen(false)} title="Edit Playlist" centered>
        <TextInput
          label="Playlist Name"
          value={editName}
          onChange={(e) => setEditName(e.currentTarget.value)}
          required
          mb="sm"
        />
        <Textarea
          label="Description"
          value={editDescription}
          onChange={(e) => setEditDescription(e.currentTarget.value)}
          autosize
          minRows={3}
        />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setEditOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </Group>
      </Modal>
    </Box>
  );
};

export default PlaylistDetails;
