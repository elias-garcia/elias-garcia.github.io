import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export interface HeadingStylesProps {
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

function getFontSizeMultiplier(
  headingType: HeadingStylesProps["type"]
): number {
  switch (headingType) {
    case "h1": {
      return 2.5;
    }
    case "h2": {
      return 2;
    }
    case "h3": {
      return 1.75;
    }
    case "h4": {
      return 1.5;
    }
    case "h5": {
      return 1.25;
    }
    default: {
      return 1;
    }
  }
}

export const useHeadingStyles = createUseStyles((theme: Theme) => ({
  heading: ({ type }: HeadingStylesProps) => ({
    fontSize: `${theme.fontSize * getFontSizeMultiplier(type)}rem`,
    fontWeight: theme.fontWeights.medium,
    lineHeight: 1.2,
    marginTop: 0,
  }),
}));
