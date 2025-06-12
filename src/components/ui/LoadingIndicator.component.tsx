import { Box, Loader, Text } from "@mantine/core";

const LoadingIndicator = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "60vh"
    }}
  >
    <Loader color="blue" size="10em" />
    <Text mt="sm">Loading...</Text>
  </Box>
);

export default LoadingIndicator;
