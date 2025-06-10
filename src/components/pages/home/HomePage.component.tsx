import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { getRandomPlaylists, IUserPlaylist } from "../../../containers/playlist/slice";
import { useStyles } from "../../playlist/playlistList/PlaylistList.styles";
import { RootState } from "../../../store/store";
import { RequestStatus } from "../../../types/requests";
import LoadingIndicator from "../../ui/LoadingIndicator.component";
import ErrorMessage from "../../ui/ErrorMessage.component";

const HomePage = () => {
  const { randomPlaylists, status, error } = useSelector((state: RootState) => state.playlistSlice);
  const { classes } = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRandomPlaylists());
  }, [dispatch]);
  if (status === RequestStatus.PENDING) return <LoadingIndicator />;
  if (status === RequestStatus.ERROR)
    return <ErrorMessage message={error || "Something went wrong"} />;

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Your Playlists
      </Typography>
      <Box className={classes.playlistContainer}>
        {randomPlaylists.map((playlist: IUserPlaylist) => (
          <Box key={playlist.id} className={classes.playlistItem}>
            <Card className={classes.card}>
              <CardMedia
                component="img"
                height="280"
                image={playlist.tracks[0]?.albumImage}
                alt={playlist.name}
                className={classes.cardMedia}
              />
              <CardContent className={classes.cardContent}>
                <Typography variant="subtitle1" className={classes.cardTitle} noWrap>
                  {playlist.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {playlist.description || "No description"}
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

export default HomePage;
