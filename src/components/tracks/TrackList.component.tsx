import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { useSelector } from "react-redux";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { ITrack } from "../../containers/tracks/slice";
import { RootState } from "../../store/store";
import { useStyles } from "./TrackList.styles";
import { RequestStatus } from "../../types/requests";
import ErrorMessage from "../ui/ErrorMessage.component";
import LoadingIndicator from "../ui/LoadingIndicator.component";

const TrackList = () => {
  const { classes } = useStyles();
  const { tracks, status, error } = useSelector((state: RootState) => state.spotifyTracks);

  if (status === RequestStatus.PENDING) return <LoadingIndicator />;
  if (status === RequestStatus.ERROR)
    return <ErrorMessage message={error || "Something went wrong"} />;

  return (
    <List className={classes.listRoot}>
      {tracks.map((track: ITrack) => (
        <Card key={track.id} className={classes.cardContainer}>
          <CardContent>
            <ListItem className={classes.listItem}>
              <ListItemAvatar>
                <img src={track.albumImage} alt={track.name} className={classes.coverImage} />
              </ListItemAvatar>

              <Box className={classes.textBox}>
                <Typography fontWeight="bold">{track.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {track.artist}
                </Typography>
              </Box>

              <Box className={classes.infoBox}>
                <Typography className={classes.label}>Album</Typography>
                <Typography>{track.album}</Typography>
              </Box>

              <Box className={classes.infoBox}>
                <Typography className={classes.label}>Release Date</Typography>
                <Typography>{track.albumReleaseDate}</Typography>
              </Box>
            </ListItem>
          </CardContent>
        </Card>
      ))}
    </List>
  );
};

export default TrackList;
