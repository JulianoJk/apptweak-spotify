import React from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { IUserPlaylist } from "../../../containers/playlist/slice";
import { useStyles } from "./PlaylistList.styles";
import { RootState } from "../../../store/store";

const PlaylistList = () => {
  const { playlists } = useSelector((state: RootState) => state.playlistSlice);
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        Your Playlists
      </Typography>
      <Box className={classes.playlistContainer}>
        {playlists.map((playlist: IUserPlaylist) => (
          <Box key={playlist.id} className={classes.playlistItem}>
            <Card className={classes.card}>
              <CardMedia
                component="img"
                height="160"
                image={playlist.tracks[0]?.albumImage}
                alt={playlist.name}
                className={classes.cardMedia}
              />
              <CardContent>
                <Typography variant="h6" className={classes.cardTitle}>
                  {playlist.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {playlist.description || "No description provided."}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {playlist.tracks.length} track{playlist.tracks.length !== 1 && "s"}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default PlaylistList;
