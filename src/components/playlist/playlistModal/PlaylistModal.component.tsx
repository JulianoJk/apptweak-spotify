import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../store/store";
import { useStyles } from "./PlaylistModal.styles";
import { Box, Button, Divider, Modal, Text, Textarea, TextInput } from "@mantine/core";
import { closeCreateModal, createSpotifyPlaylist } from "../../../containers/playlist/slice";

const PlaylistModal = () => {
  const { classes } = useStyles();
  const { isModalOpen } = useSelector((state: RootState) => state.playlistSlice);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const handleCreate = () => {
    if (name.trim()) {
      dispatch(createSpotifyPlaylist({ name, description }));
      dispatch(closeCreateModal());
      setName("");
      setDescription("");
    }
  };

  const handleClose = () => {
    dispatch(closeCreateModal());
    setName("");
    setDescription("");
  };

  return (
    <Modal opened={isModalOpen} onClose={handleClose}>
      <Box>
        <Text fw={700} className={classes.title}>
          Create New Playlist
        </Text>

        <Divider />

        <TextInput
          label="Playlist name"
          placeholder="Playlist name"
          className={classes.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          variant="filled"
          label="Description (optional)"
          placeholder="Description (optional)"
          className={classes.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box className={classes.actions}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create Playlist
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PlaylistModal;
