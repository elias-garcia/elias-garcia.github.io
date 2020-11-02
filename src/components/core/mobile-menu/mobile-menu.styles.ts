import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export const useMobileMenuStyles = createUseStyles((theme: Theme) => ({
  background: {
    position: "fixed",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    background: theme.palette.black,
    opacity: 0.2,
    [theme.breakpoints.upMd]: {
      display: "none",
    },
  },
  sidebar: {
    position: "fixed",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    background: theme.palette.white,
    padding: `0 ${theme.spacing(2)}px`,
    display: "flex",
    flexDirection: "column",
    "&:focus": {
      outline: "none",
    },
    [theme.breakpoints.upSm]: {
      width: 320,
      right: "auto",
      padding: `0 ${theme.spacing(8)}px`,
    },
    [theme.breakpoints.upMd]: {
      display: "none",
    },
  },
  sidebarHeader: {
    height: theme.headerHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    margin: 0,
  },
  closeButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    color: theme.palette.black,
    "&:focus": {
      outline: "none",
    },
  },
  linkList: {
    display: "flex",
    flexDirection: "column",
    listStyle: "none",
    margin: 0,
    marginTop: theme.spacing(2),
    paddingLeft: 0,
    [theme.breakpoints.upSm]: {
      marginTop: theme.spacing(4),
    },
  },
  linkWrapper: {
    display: "flex",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    width: "100%",
    padding: theme.spacing(2),
    borderRadius: theme.borderRadius,
  },
  activeLink: {
    background: theme.palette.primary.light,
    color: theme.palette.primary.main,
  },
}));
