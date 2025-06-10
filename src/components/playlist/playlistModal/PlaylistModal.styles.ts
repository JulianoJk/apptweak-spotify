import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30em",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    boxShadow: theme.shadows[5],
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
  },
  input: {
    marginTop: theme.spacing(1)
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing(2)
  }
}));
