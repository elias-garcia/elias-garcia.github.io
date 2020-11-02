import { createUseStyles } from "react-jss";
import { Theme } from "../../../styles/theme";

export const useLayoutStyles = createUseStyles((theme: Theme) => ({
  "@global": {
    body: {
      fontFamily: "Rubik",
      fontSize: `${theme.fontSize}rem`,
      color: theme.palette.black,
    },
    p: {
      lineHeight: theme.lineHeight,
    },
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
}));
