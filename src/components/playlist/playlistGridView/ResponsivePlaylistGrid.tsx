import { Box, Button, Card, Image, SimpleGrid, Text } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import LoadingIndicator from "../../ui/LoadingIndicator.component";
import ErrorMessage from "../../ui/ErrorMessage.component";
import {
  getPersonalPlaylists,
  IPersonalPlaylist,
  openCreateModal
} from "../../../containers/playlist/slice";
import { RequestStatus } from "../../../types/requests";
import { useStyles } from "./PlaylistGridView.styles";
import { IconLibraryPlus } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

const ResponsivePlaylistGrid = ({ context = "page" }: { context?: "modal" | "page" }) => {
  const { classes, cx } = useStyles({ disableHover: context === "modal" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 56.25em)");

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

  const createPlaylist = () => {
    dispatch(openCreateModal());
  };

  if (status === RequestStatus.PENDING) return <LoadingIndicator />;
  if (status === RequestStatus.ERROR)
    return <ErrorMessage message={error || "Something went wrong"} />;

  if (personalPlaylists.length === 0)
    return (
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh"
        }}
      >
        <Text c="dimmed" size="md" mb="md" ta="center">
          You have no playlists yet. Create one to get started!
        </Text>
        <Button
          variant="default"
          onClick={createPlaylist}
          rightSection={<IconLibraryPlus size={16} />}
        >
          Create new playlist
        </Button>
      </Box>
    );

  const paddingX = context === "page" ? (isDesktop ? "xl" : "md") : "md";
  const paddingY = context === "page" ? (isDesktop ? "xl" : "md") : "md";

  return (
    <Box px={paddingX} py={paddingY}>
      <Text
        className={classes.title}
        size={isDesktop ? "xl" : "lg"}
        w={isDesktop ? 700 : "100%"}
        mb="md"
      >
        Your Playlists
      </Text>
      <SimpleGrid spacing={isDesktop ? "xl" : "md"} cols={isDesktop ? 4 : 1}>
        {personalPlaylists.map((playlist: IPersonalPlaylist) => (
          <Card
            key={playlist.id}
            p="md"
            radius="md"
            className={cx(classes.card)}
            onClick={() => handleCardClick(playlist.id)}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
          >
            <Image
              src={playlist.image || "https://placehold.co/600x400?text=No+Image"}
              radius="md"
              className={classes.image}
              height={isDesktop ? (context === "page" ? 160 : 100) : 120}
              width="100%"
              fit="cover"
            />
            <Box className={classes.textWrapper} mt="sm">
              <Text
                className={classes.title}
                size={isDesktop ? (context === "page" ? "md" : "sm") : "sm"}
              >
                {playlist.name}
              </Text>
              <Text c="dimmed" size={isDesktop ? (context === "page" ? "sm" : "xs") : "xs"}>
                By {playlist.owner.display_name} • {playlist.tracks.length} tracks
              </Text>
            </Box>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ResponsivePlaylistGrid;
