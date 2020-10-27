import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export const useContainerStyles = createUseStyles((theme: Theme) => ({
  container: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: `0 ${theme.spacing(2)}px`,
  },
}));
