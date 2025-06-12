import { createStyles } from "@mantine/emotion";

export const useStyles = createStyles((theme) => ({
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "32em",
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.md
  },
  title: {
    marginBottom: theme.spacing.sm
  },
  input: {
    marginTop: theme.spacing.sm
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing.md,
    gap: theme.spacing.md
  }
}));