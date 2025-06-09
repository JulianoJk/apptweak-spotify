import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  listRoot: {
    width: "100%",
    maxWidth: "80em",
    margin: "auto",
    paddingTop: theme.spacing(2)
  },
  cardContainer: {
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: "none",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
  },
  listItem: {
    display: "flex",
    alignItems: "center"
  },
  coverImage: {
    width: 64,
    height: 64,
    objectFit: "cover",
    borderRadius: theme.shape.borderRadius
  },
  textBox: {
    flex: 1,
    marginLeft: theme.spacing(2)
  },
  infoBox: {
    flex: 1
  },
  label: {
    fontWeight: theme.typography.fontWeightMedium,
    fontStyle: "italic",
    fontSize: "0.8rem",
    color: theme.palette.text.secondary
  }
}));
