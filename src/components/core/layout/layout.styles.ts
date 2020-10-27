import { createUseStyles } from "react-jss";
import { Theme } from "../../../styles/theme";

export const useLayoutStyles = createUseStyles((theme: Theme) => ({
  "@global": {
    body: {
      fontFamily: "Rubik",
      fontSize: "1.125rem",
      color: theme.palette.black,
    },
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
}));
