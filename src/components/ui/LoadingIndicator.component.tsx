import { CircularProgress, Box } from "@mui/material";

const LoadingIndicator = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60vh"
    }}
  >
    <CircularProgress size={160} />
  </Box>
);

export default LoadingIndicator;
