import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateModal, createPlaylist } from "../../../containers/playlist/slice";
import { RootState } from "../../../store/store";
import { useStyles } from "./PlaylistModal.styles";
import { useState } from "react";
import { useNavigate } from "react-router";

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
    }
  };

  return (
    <Modal open={isModalOpen} onClose={() => dispatch(closeCreateModal())}>
      <Box className={classes.modal}>
        <Typography variant="h6">Add new playlist</Typography>
        <TextField
          label="Playlist name"
          variant="outlined"
          fullWidth
          className={classes.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Playlist description (optional)"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          className={classes.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box className={classes.actions}>
          <Button onClick={() => dispatch(closeCreateModal())}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PlaylistModal;
