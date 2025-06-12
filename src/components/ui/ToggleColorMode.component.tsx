import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
const ToggleColorMode = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };
  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      size="xl"
      variant="outline"
      color={colorScheme === "dark" ? "yellow" : "#0c8599"}
      aria-label="Toggle color scheme"
    >
      {colorScheme === "dark" ? <IconSun stroke={1.5} /> : <IconMoon stroke={2} />}
    </ActionIcon>
  );
};
export default ToggleColorMode;
