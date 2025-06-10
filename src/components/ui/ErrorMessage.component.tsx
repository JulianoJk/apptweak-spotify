import { Alert, Box } from "@mui/material";

const ErrorMessage = ({ message }: { message: string }) => (
  <Box
    sx={{
      position: "fixed",
      bottom: 32,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "35em",
      px: 2,
      zIndex: 1400
    }}
  >
    <Alert severity="error" variant="filled" sx={{ fontSize: "1rem" }}>
      {message}
    </Alert>
  </Box>
);

export default ErrorMessage;
