import { Alert, Box } from "@mantine/core";

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
    <Alert variant="light" color="red" radius="md" title="An error occurred">
      {message}
    </Alert>
  </Box>
);

export default ErrorMessage;
