import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export const useDisplayHeadingStyles = createUseStyles((theme: Theme) => ({
  displayHeading: {
    fontSize: `${theme.fontSize * 3}rem`,
    fontWeight: theme.fontWeights.medium,
    lineHeight: 1.2,
    marginTop: 0,
  },
}));
