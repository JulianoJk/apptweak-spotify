import { Box, Card, Image, SimpleGrid, Text } from "@mantine/core";
import { useStyles } from "./PlaylistGridView.styles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import LoadingIndicator from "../../ui/LoadingIndicator.component";
import ErrorMessage from "../../ui/ErrorMessage.component";
import { getPersonalPlaylists, IPersonalPlaylist } from "../../../containers/playlist/slice";
import { RequestStatus } from "../../../types/requests";

interface PlaylistListProps {
  context?: "modal" | "page";
}

const PlaylistGridDesktop = ({ context = "page" }: PlaylistListProps) => {
  console.log("PlaylistGridDesktop rendered");

  const { classes } = useStyles({ disableHover: context === "modal" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { personalPlaylists, status, error } = useSelector(
    (state: RootState) => state.playlistSlice
  );

  useEffect(() => {
    if (status === RequestStatus.IDLE) {
      dispatch(getPersonalPlaylists());
    }
  }, [dispatch, status]);

  const handleCardClick = (id: string) => {
    if (context === "page") {
      navigate(`/playlist/${id}`);
    }
  };

  if (status === RequestStatus.PENDING) return <LoadingIndicator />;
  if (status === RequestStatus.ERROR)
    return <ErrorMessage message={error || "Something went wrong"} />;

  return (
    <Box px={context === "page" ? "xl" : "md"} py={context === "page" ? "xl" : "md"}>
      <Text className={classes.title} size="xl" w={700} mb="md">
        Your Playlists
      </Text>
      <SimpleGrid spacing={context === "page" ? "xl" : "md"} cols={context === "page" ? 4 : 3}>
        {personalPlaylists.map((playlist: IPersonalPlaylist) => (
          <Card
            key={playlist.id}
            p="md"
            radius="md"
            className={classes.card}
            onClick={() => handleCardClick(playlist.id)}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <Image
              src={playlist.image || "https://placehold.co/600x400?text=No+Image"}
              radius="md"
              className={classes.image}
              height={context === "page" ? 160 : 100}
              width="100%"
              fit="cover"
            />
            <Box className={classes.textWrapper} mt="sm">
              <Text className={classes.title} size={context === "page" ? "md" : "sm"}>
                {playlist.name}
              </Text>
              <Text c="dimmed" size={context === "page" ? "sm" : "xs"}>
                By {playlist.owner.display_name} &#x2022; {playlist.tracks.length} tracks
              </Text>
            </Box>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PlaylistGridDesktop;
