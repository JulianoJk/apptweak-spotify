import { rem } from "@mantine/core";
import { createStyles } from "@mantine/emotion";

export const useStyles = createStyles((theme) => ({
  appBar: {
    padding: `0 ${theme.spacing.md}`,
    display: "flex",
    alignItems: "center"
  },
  inner: {
    height: rem(96),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: rem(56)
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md
  },

  leftSide: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
    flexGrow: 1,
    maxWidth: rem(600)
  },

  rightSide: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md
  },

  textField: {
    flexGrow: 1
  },

  searchButton: {
    height: rem(40),
    borderRadius: rem(8),
    fontWeight: 500,
    paddingInline: theme.spacing.md
  },

  playlistButton: {
    height: rem(40),
    borderRadius: rem(8),
    textTransform: "none",
    fontWeight: 500,
    paddingInline: theme.spacing.md
  },

  toggleBox: {
    display: "flex",
    alignItems: "center"
  }
}));
