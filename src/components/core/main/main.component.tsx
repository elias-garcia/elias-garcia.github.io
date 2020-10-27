import React from "react";
import { useMainStyles } from "./main.styles";

export const Main: React.FC = ({ children }) => {
  const classes = useMainStyles();

  return <main className={classes.main}>{children}</main>;
};
