import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export const useContainerStyles = createUseStyles((theme: Theme) => ({
  container: {
    flex: "1 1 100%",
    margin: "0 auto",
    padding: `0 ${theme.spacing(2)}px`,
    [theme.breakpoints.upSm]: {
      maxWidth: 540,
    },
    [theme.breakpoints.upMd]: {
      maxWidth: 720,
    },
    [theme.breakpoints.upLg]: {
      maxWidth: 960,
    },
    [theme.breakpoints.upXl]: {
      maxWidth: 1140,
    },
  },
}));
