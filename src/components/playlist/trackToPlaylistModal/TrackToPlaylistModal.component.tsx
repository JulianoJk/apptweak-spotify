import {
  Box,
  Modal,
  Text,
  Title,
  Button,
  SimpleGrid,
  Group,
  Image,
  ScrollArea,
  Divider
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { addTracksToPlaylists, closePlaylistSelectModal } from "../../../containers/playlist/slice";
import { RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { getPersonalPlaylists, IPersonalPlaylist } from "../../../containers/playlist/slice";
import { useStyles } from "../playlistList/PlaylistList.styles";
import { RequestStatus } from "../../../types/requests";

interface ITrackToPlaylistModalProps {
  selectedTrackIds: string[];
}
const TrackToPlaylistModal = (props: ITrackToPlaylistModalProps) => {
  const dispatch = useDispatch();
  const { playlistSelectorModal, personalPlaylists, status } = useSelector(
    (state: RootState) => state.playlistSlice
  );
  const { classes } = useStyles({ disableHover: true });

  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  useEffect(() => {
    if (status === RequestStatus.IDLE && personalPlaylists.length === 0) {
      dispatch(getPersonalPlaylists());
    }
  }, [dispatch, status, personalPlaylists.length]);
  const toggleSelection = (id: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleClose = () => {
    dispatch(closePlaylistSelectModal());
    setSelectedPlaylists([]);
  };

  const handleAdd = () => {
    const trackUris = props.selectedTrackIds.map((id) => `spotify:track:${id}`);

    dispatch(
      addTracksToPlaylists({
        playlistIds: selectedPlaylists,
        trackUris
      })
    );
    handleClose();
  };

  return (
    <Modal
      opened={playlistSelectorModal}
      onClose={handleClose}
      title="Select Playlist(s)"
      size="xl"
      centered
      padding="lg"
    >
      <Box>
        <Text size="sm" c="dimmed" mb="md">
          Choose one or more playlists where you want to add the selected track(s).
        </Text>
        <Divider />

        <ScrollArea h="25em" scrollbars="y">
          <SimpleGrid spacing="md" cols={3}>
            {personalPlaylists.map((playlist: IPersonalPlaylist) => {
              const isSelected = selectedPlaylists.includes(playlist.id);
              return (
                <Box
                  key={playlist.id}
                  className={classes.card}
                  style={{
                    border: isSelected ? "2px solid #339af0" : "2px solid transparent",
                    borderRadius: "8px",
                    padding: "8px",
                    cursor: "pointer"
                  }}
                  onClick={() => toggleSelection(playlist.id)}
                >
                  <Image
                    src={playlist.image || "https://placehold.co/400x300?text=No+Image"}
                    alt=""
                    style={{ width: "100%", height: 250, objectFit: "cover", borderRadius: 6 }}
                  />
                  <Box mt="sm">
                    <Text fw={500} size="sm">
                      {playlist.name}
                    </Text>
                    <Text c="dimmed" size="xs">
                      By {playlist.owner.display_name} • {playlist.tracks.length} tracks
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        </ScrollArea>
        <Divider />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={selectedPlaylists.length === 0}>
            Add to Playlist
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};

export default TrackToPlaylistModal;
