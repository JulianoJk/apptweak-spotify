import { Box, Card, Image, SimpleGrid, Text } from "@mantine/core";
import { useStyles } from "./PlaylistList.styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import LoadingIndicator from "../../ui/LoadingIndicator.component";
import ErrorMessage from "../../ui/ErrorMessage.component";
import { getPersonalPlaylists, IPersonalPlaylist } from "../../../containers/playlist/slice";
import { RequestStatus } from "../../../types/requests";

const PlaylistList = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { personalPlaylists, status, error } = useSelector(
    (state: RootState) => state.playlistSlice
  );

  useEffect(() => {
    if (status === RequestStatus.IDLE && personalPlaylists.length === 0) {
      dispatch(getPersonalPlaylists());
    }
  }, [dispatch, status, personalPlaylists.length]);

  const handleCardClick = (id: string) => {
    navigate(`/playlist/${id}`);
  };

  if (status === RequestStatus.PENDING) return <LoadingIndicator />;
  if (status === RequestStatus.ERROR)
    return <ErrorMessage message={error || "Something went wrong"} />;

  return (
    <Box px="xl" py="xl">
      <Text className={classes.title} size="xl" w={700}>
        Your Playlists
      </Text>
      <SimpleGrid spacing="xl" cols={4}>
        {personalPlaylists.map((playlist: IPersonalPlaylist) => (
          <Card
            key={playlist.id}
            p="md"
            radius="md"
            className={classes.card}
            onClick={() => handleCardClick(playlist.id)}
            role="button"
            tabIndex={0}
          >
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
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PlaylistList;
