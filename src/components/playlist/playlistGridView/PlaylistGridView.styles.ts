import { rem } from "@mantine/core";
import { createStyles } from "@mantine/emotion";

interface StyleProps {
  disableHover?: boolean;
}

export const useStyles = createStyles((theme, { disableHover }: StyleProps) => ({
  card: {
    height: rem(340),
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease",
    ...(disableHover
      ? {}
      : {
          "&:hover": {
            transform: "scale(1.02)"
          }
        })
  },

  image: {
    height: rem(200),
    width: "100%",
    objectFit: "cover",
    borderRadius: theme.radius.md
  },

  textWrapper: {
    paddingTop: theme.spacing.md
  },

  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 700,
    lineHeight: 1.2
  },

  subtitle: {
    color: theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    marginTop: rem(4)
  }
}));
