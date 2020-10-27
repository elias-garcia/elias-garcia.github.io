import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export const useMainStyles = createUseStyles((theme: Theme) => ({
  main: {
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.headerHeight,
    flex: 1,
  },
}));
