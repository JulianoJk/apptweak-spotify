import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    padding: theme.spacing(1, 2)
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  leftSide: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    flexGrow: 1,
    maxWidth: "600px"
  },
  rightSide: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2)
  },
  textField: {
    flexGrow: 1
  },
  searchButton: {
    height: "2.5em",
    borderRadius: "0.5em",
    textTransform: "none",
    fontWeight: 500,
    paddingInline: theme.spacing(2),
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary
  },
  playlistButton: {
    height: "2.5em",
    borderRadius: "0.5em",
    textTransform: "none",
    fontWeight: 500,
    paddingInline: theme.spacing(2)
  },
  toggleBox: {
    display: "flex",
    alignItems: "center"
  },
  navLinks: {
    display: "flex",
    gap: theme.spacing(2),
    alignItems: "center"
  }
}));
