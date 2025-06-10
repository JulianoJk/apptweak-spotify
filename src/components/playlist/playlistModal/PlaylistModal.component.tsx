import React, { useState } from "react";
import { Box, Typography, Modal, TextField, Button, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateModal, createPlaylist } from "../../../containers/playlist/slice";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router";
import { useStyles } from "./PlaylistModal.styles";

const PlaylistModal = () => {
  const { classes } = useStyles();
  const { isModalOpen } = useSelector((state: RootState) => state.playlistSlice);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (name.trim()) {
      dispatch(createPlaylist({ name, description }));
      dispatch(closeCreateModal());
      navigate("/playlists");
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
    <Modal open={isModalOpen} onClose={handleClose}>
      <Box className={classes.modal}>
        <Typography variant="h5" className={classes.title}>
          Create New Playlist
        </Typography>

        <Divider />

        <TextField
          label="Playlist name"
          variant="outlined"
          fullWidth
          className={classes.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description (optional)"
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          className={classes.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box className={classes.actions}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCreate} disabled={!name.trim()}>
            Create Playlist
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PlaylistModal;
