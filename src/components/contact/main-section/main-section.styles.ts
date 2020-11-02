import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export const useMainSectionStyles = createUseStyles((theme: Theme) => ({
  content: {
    margin: `${theme.spacing(15)}px 0`,
  },
  text: {
    margin: 0,
  },
  contactLinksWrapper: {
    marginTop: theme.spacing(4),
  },
}));
