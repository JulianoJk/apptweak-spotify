import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { useSelector } from "react-redux";
import { Card, CardContent } from "@mui/material";

const DisplayTracks = () => {
  const tracks = useSelector((state: any) => state.spotifyTracks.tracks);
  return (
    <>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {tracks.map((track: any) => (
          <Card sx={{ maxWidth: 345, marginTop: 2 }}>
            <CardContent>
              <ListItem key={track.id}>
                <ListItemAvatar>
                  <img src={track.albumImage} alt="something else" height={64} width={64}></img>
                </ListItemAvatar>
                <ListItemText primary={track.name} secondary="Jan 9, 2014" />
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
    </>
  );
};
export default DisplayTracks;
