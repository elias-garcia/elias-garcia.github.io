import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export const useContactListStyles = createUseStyles((theme: Theme) => ({
  contactLinks: {
    listStyle: "none",
    paddingLeft: 0,
    margin: 0,
    marginLeft: -theme.spacing(1),
  },
  contactLinkWrapper: {
    display: "flex",
    "&:not(:last-of-type)": {
      marginBottom: theme.spacing(1),
    },
  },
  contactLink: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  icon: {
    padding: theme.spacing(1),
    background: theme.palette.primary.light,
    color: theme.palette.primary.main,
    borderRadius: theme.borderRadius,
    marginRight: theme.spacing(2),
  },
}));
