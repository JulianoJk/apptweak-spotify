import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "32em",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4),
    boxShadow: theme.shadows[6],
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: theme.spacing(1)
  },
  input: {
    marginTop: theme.spacing(1)
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing(3),
    gap: theme.spacing(2)
  }
}));
