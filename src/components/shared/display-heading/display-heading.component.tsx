import React from "react";
import { useDisplayHeadingStyles } from "./display-heading.styles";

export const DisplayHeading: React.FC = ({ children }) => {
  const classes = useDisplayHeadingStyles();

  return <h1 className={classes.displayHeading}>{children}</h1>;
};
