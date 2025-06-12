import { useMediaQuery } from "@mantine/hooks";

import PlaylistGridDesktop from "./PlaylistGridDesktop.component";
import PlaylistGridMobile from "./PlaylistGridMobile.component";

const ResponsivePlaylistGrid = () => {
  const matches = useMediaQuery("(min-width: 56.25em)");
  return matches ? <PlaylistGridDesktop /> : <PlaylistGridMobile />;
};

export default ResponsivePlaylistGrid;
