import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export const useHeaderStyles = createUseStyles((theme: Theme) => ({
  header: {
    height: theme.headerHeight,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoWrapper: {
    display: "flex",
    margin: 0,
    marginLeft: -theme.spacing(1),
  },
  logoLink: {
    display: "flex",
    padding: theme.spacing(1),
  },
  logo: {
    height: 48,
  },
  nav: {
    display: "none",
    [theme.breakpoints.upMd]: {
      display: "flex",
      alignItems: "center",
    },
  },
  mobileMenu: {
    display: "flex",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: theme.palette.black,
    padding: 0,
    "&:focus": {
      outline: "none",
    },
    [theme.breakpoints.upMd]: {
      display: "none",
    },
  },
  linkList: {
    display: "flex",
    listStyle: "none",
    margin: 0,
    paddingLeft: 0,
  },
  linkWrapper: {
    display: "flex",
  },
  link: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: "inherit",
    textDecoration: "none",
    position: "relative",
  },
  activeLink: {
    color: theme.palette.primary.main,
    "&:after": {
      content: "''",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: theme.spacing(0.25),
      margin: `0 ${theme.spacing(2)}px`,
      height: 2,
      background: theme.palette.primary.main,
    },
  },
  ctaButton: {
    display: "flex",
    marginLeft: theme.spacing(2),
  },
}));
