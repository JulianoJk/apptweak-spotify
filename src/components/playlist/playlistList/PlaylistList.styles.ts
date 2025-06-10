import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  root: {
    padding: theme.spacing(6),
    backgroundColor: theme.palette.background.default
  },
  title: {
    marginBottom: theme.spacing(4),
    fontWeight: 700,
    color: theme.palette.text.primary
  },
  playlistContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: theme.spacing(4),
    justifyItems: "center",
    backgroundColor: "transparent"
  },
  playlistItem: {
    width: 220
  },
  card: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)"
    }
  },
  cardMedia: {
    height: 280,
    objectFit: "cover",
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius
  },
  cardContent: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  cardTitle: {
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: theme.spacing(0.5)
  }
}));
