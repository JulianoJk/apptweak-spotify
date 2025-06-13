import { useEffect, useState } from "react";
import { Checkbox, ScrollArea, Table, Tooltip, ActionIcon } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useParams } from "react-router";
import { fetchTracks } from "../../containers/tracks/slice";
import { RequestStatus } from "../../types/requests";
import LoadingIndicator from "../ui/LoadingIndicator.component";
import ErrorMessage from "../ui/ErrorMessage.component";
import { IconPlaylistAdd } from "@tabler/icons-react";

import { openPlaylistSelectModal } from "../../containers/playlist/slice";
import TrackTableRow from "./TrackTableRow.component";
import SelectPlaylistModal from "../playlist/selectPlaylistModal/SelectPlaylistModal.component";

const TrackList = () => {
  const dispatch = useDispatch();
  const { query } = useParams<{ query: string }>();
  const { tracks, status, error } = useSelector((state: RootState) => state.spotifyTracks);

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  useEffect(() => {
    if (query && tracks.length === 0 && status === RequestStatus.IDLE) {
      dispatch(fetchTracks(query));
    }
  }, [dispatch, query, tracks.length, status]);

  const toggleRow = (id: string) =>
    setSelectedTracks((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const toggleAll = () =>
    setSelectedTracks((current) =>
      current.length === tracks.length ? [] : tracks.map((t) => t.id)
    );

  if (status === RequestStatus.PENDING) return <LoadingIndicator />;
  if (status === RequestStatus.ERROR)
    return <ErrorMessage message={error || "Something went wrong"} />;

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}>
              <Checkbox
                onChange={toggleAll}
                checked={selectedTracks.length === tracks.length}
                indeterminate={selectedTracks.length > 0 && selectedTracks.length !== tracks.length}
              />
            </Table.Th>
            <Table.Th>#</Table.Th>
            <Table.Th>Track</Table.Th>
            <Table.Th>Album</Table.Th>
            <Table.Th>Release Date</Table.Th>
            <Table.Th w={60}>
              {selectedTracks.length > 0 && (
                <Tooltip label="Add selected to playlist" withArrow>
                  <ActionIcon
                    variant="filled"
                    onClick={() => dispatch(openPlaylistSelectModal())}
                    color="blue"
                    aria-label="Add to Playlist"
                  >
                    <IconPlaylistAdd style={{ width: "70%", height: "70%" }} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {tracks.map((track, index) => (
            <TrackTableRow
              key={track.id}
              showCheckbox={true}
              track={track}
              index={index}
              isSelected={selectedTracks.includes(track.id)}
              onToggle={toggleRow}
            />
          ))}
        </Table.Tbody>
      </Table>
      <SelectPlaylistModal selectedTrackIds={selectedTracks} />
    </ScrollArea>
  );
};

export default TrackList;
