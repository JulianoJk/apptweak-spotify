import { makeStyles } from "tss-react/mui";

export const useStyles = makeStyles()((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    padding: theme.spacing(1, 2)
  },
  title: {
    flexShrink: 0,
    fontWeight: theme.typography.fontWeightBold
  },
  searchSection: {
    width: "30em",
    marginInline: theme.spacing(4),
    display: "flex",
    gap: theme.spacing(1),
    alignItems: "center",
    justifyContent: "flex-start"
  },
  textField: {
    width: "100%"
  },
  searchButton: {
    height: "2.5em",
    borderRadius: "3em",
    textTransform: "none",
    fontWeight: 500,
    paddingInline: theme.spacing(2),
    borderColor: theme.palette.divider,
    color: theme.palette.text.primary
  },
  toggleBox: {
    flexShrink: 0
  }
}));
