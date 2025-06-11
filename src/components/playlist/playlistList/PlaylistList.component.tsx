import { Box, Card, Image, SimpleGrid, Text } from "@mantine/core";
import { useStyles } from "./PlaylistList.styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { getPersonalPlaylists, IPersonalPlaylist } from "../../../containers/playlist/slice";
import { useEffect } from "react";
import LoadingIndicator from "../../ui/LoadingIndicator.component";
import { RequestStatus } from "../../../types/requests";
import ErrorMessage from "../../ui/ErrorMessage.component";

const PlaylistList = () => {
  const { classes } = useStyles();
  const { personalPlaylists, status, error } = useSelector(
    (state: RootState) => state.playlistSlice
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPersonalPlaylists());
  }, [dispatch]);
  if (status === RequestStatus.PENDING) return <LoadingIndicator />;
  if (status === RequestStatus.ERROR)
    return <ErrorMessage message={error || "Something went wrong"} />;

  const cards = personalPlaylists.map((playlist: IPersonalPlaylist) => (
    <Card key={playlist.name} p="md" radius="md" component="a" href="#" className={classes.card}>
      <Image
        src={playlist.image}
        fallbackSrc="https://placehold.co/600x400?text=No+Image"
        radius="md"
        className={classes.image}
      />

      <Box className={classes.textWrapper}>
        <Text className={classes.title}>{playlist.name}</Text>
        <Text className={classes.subtitle}>
          By {playlist.owner.display_name} &#x2022; {playlist.tracks.length} tracks
        </Text>
      </Box>
    </Card>
  ));

  return (
    <Box px="xl" py="xl">
      <Text className={classes.title} size="xl" w={700}>
        Your Playlists
      </Text>
      <SimpleGrid spacing="xl" cols={4}>
        {cards}
      </SimpleGrid>
    </Box>
  );
};
export default PlaylistList;
