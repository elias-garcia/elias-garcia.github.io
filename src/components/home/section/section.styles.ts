import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export interface SectionStylesProps {
  background?: "primary";
}

export const useSectionStyles = createUseStyles((theme: Theme) => ({
  section: ({ background }: SectionStylesProps) => ({
    display: "flex",
    background:
      background === "primary"
        ? theme.palette.primary.light
        : theme.palette.white,
  }),
}));
