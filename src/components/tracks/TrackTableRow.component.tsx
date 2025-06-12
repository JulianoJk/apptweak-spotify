import { Avatar, Checkbox, Group, Table, Text, useMantineColorScheme } from "@mantine/core";
import { ITrack } from "../../containers/tracks/slice";

interface TrackTableRowProps {
  track: ITrack;
  index?: number;
  showIndex?: boolean;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onToggle?: (trackId: string) => void;
}

const TrackTableRow = ({
  track,
  index,
  showIndex = true,
  showCheckbox = true,
  isSelected = false,
  onToggle
}: TrackTableRowProps) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Table.Tr
      sx={{
        backgroundColor: isSelected ? (colorScheme === "dark" ? "#2c2e33" : "#F8F9FA") : "inherit"
      }}
    >
      {showCheckbox && (
        <Table.Td>
          <Checkbox checked={isSelected} onChange={() => onToggle?.(track.id)} />
        </Table.Td>
      )}
      {showIndex && <Table.Td>{(index ?? 0) + 1}</Table.Td>}
      <Table.Td>
        <Group>
          <Avatar src={track.albumImage} size={60} radius="sm" />
          <div>
            <Text fw={500}>{track.name}</Text>
            <Text size="xs" c="dimmed">
              {track.artist}
            </Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>{track.album}</Table.Td>
      <Table.Td>{track.albumReleaseDate}</Table.Td>
    </Table.Tr>
  );
};

export default TrackTableRow;
