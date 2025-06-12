import { IconButton, PaletteMode } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface ToggleColorModeProps {
  mode: PaletteMode;
  setMode: () => void;
}

const ToggleColorMode = ({ mode, setMode }: ToggleColorModeProps) => {
  const isDark = mode === "dark";

  return (
    <IconButton
      onClick={setMode}
      size="small"
      color="inherit"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <LightModeIcon fontSize="medium" sx={{ color: "#FFD700" }} />
      ) : (
        <DarkModeIcon fontSize="medium" sx={{ color: "#151515" }} />
      )}
    </IconButton>
  );
};

export default ToggleColorMode;
