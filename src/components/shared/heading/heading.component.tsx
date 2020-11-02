import React from "react";

import { HeadingStylesProps, useHeadingStyles } from "./heading.styles";

interface HeadingProps {
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading: React.FC<HeadingProps> = ({ type, children }) => {
  const headingStylesProps: HeadingStylesProps = { type };
  const classes = useHeadingStyles(headingStylesProps);
  const Component: React.ElementType = type;

  return <Component className={classes.heading}>{children}</Component>;
};
