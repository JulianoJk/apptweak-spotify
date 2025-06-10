import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default
  },
  title: {
    marginBottom: theme.spacing(3),
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary
  },
  playlistContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(3)
  },
  playlistItem: {
    minWidth: 240,
    maxWidth: 300
  },
  card: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    "&:hover": {
      transform: "scale(1.03)"
    }
  },
  cardMedia: {
    objectFit: "cover"
  },
  cardTitle: {
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: theme.spacing(1)
  }
}));
