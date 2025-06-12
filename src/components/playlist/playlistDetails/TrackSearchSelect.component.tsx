import { MultiSelect, Loader, Avatar, Group, Text, Tooltip, Box, Divider } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { fetchTracks, ITrack } from "../../../containers/tracks/slice";
import { RequestStatus } from "../../../types/requests";
import { IconCheck } from "@tabler/icons-react";

interface ITrackSearchSelectProps {
  searchSelection: string[];
  setSearchSelection: (ids: string[]) => void;
  playlistTrackIds: string[];
}

type TrackOption = {
  value: string;
  label: string;
  name: string;
  album: string;
  image: string;
  alreadyInPlaylist: boolean;
};

const TrackSearchSelect = ({
  searchSelection,
  setSearchSelection,
  playlistTrackIds
}: ITrackSearchSelectProps) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 400);

  const { tracks, status } = useSelector((state: RootState) => state.spotifyTracks);

  useEffect(() => {
    if (debouncedSearch.trim().length > 1) {
      dispatch(fetchTracks(debouncedSearch));
    }
  }, [debouncedSearch, dispatch]);

  const fullTrackOptions: TrackOption[] = tracks.map((track: ITrack) => ({
    value: track.id,
    label: `${track.name} - ${track.artist}`,
    name: track.name,
    album: track.album,
    image: track.albumImage,
    alreadyInPlaylist: playlistTrackIds.includes(track.id)
  }));

  const visibleOptions = fullTrackOptions.filter(
    (option) => !searchSelection.includes(option.value)
  );

  return (
    <MultiSelect
      sx={{ maxWidth: "30em" }}
      label="Add tracks to playlist"
      placeholder="Search for tracks"
      searchable
      data={[
        ...visibleOptions,
        ...fullTrackOptions.filter((option) => searchSelection.includes(option.value))
      ]}
      value={searchSelection}
      onSearchChange={setSearchValue}
      onChange={setSearchSelection}
      maxDropdownHeight={200}
      checkIconPosition="left"
      size="sm"
      style={{ flex: 1 }}
      rightSection={status === RequestStatus.PENDING ? <Loader size="xs" /> : null}
      renderOption={({ option }) => {
        const { name, album, image, alreadyInPlaylist } = option as TrackOption;

        return (
          <Group gap="sm" justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <Avatar src={image || "https://placehold.co/40x40"} radius="sm" size="sm" />
              <Box style={{ minWidth: 0 }}>
                <Text size="sm" truncate="end">
                  {name}
                </Text>
                <Text size="xs" c="dimmed" truncate="end">
                  {album}
                </Text>
              </Box>
            </Group>

            {alreadyInPlaylist && (
              <Tooltip label="Track already in playlist" withArrow>
                <Box sx={{ marginLeft: "auto" }}>
                  <IconCheck size={26} color="green" />
                </Box>
              </Tooltip>
            )}
          </Group>
        );
      }}
    />
  );
};

export default TrackSearchSelect;
