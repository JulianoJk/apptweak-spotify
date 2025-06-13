import { useMediaQuery } from "@mantine/hooks";
import PlaylistDetailsDesktop from "./PlaylistDetailsDesktop.component";
import PlaylistDetailsMobile from "./PlaylistDetailsMobile.component";

const ResponsivePlaylistDetails = () => {
  const isDesktop = useMediaQuery("(min-width: 56.25em)");
  return isDesktop ? <PlaylistDetailsDesktop /> : <PlaylistDetailsMobile />;
};

export default ResponsivePlaylistDetails;
