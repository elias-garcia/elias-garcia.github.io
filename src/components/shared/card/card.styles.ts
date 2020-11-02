import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export interface CardStylesProps {
  background: "primary";
}

export const useCardStyles = createUseStyles((theme: Theme) => ({
  card: ({ background }: CardStylesProps) => ({
    background:
      background === "primary"
        ? theme.palette.primary.light
        : theme.palette.white,
    padding: theme.spacing(5),
    borderRadius: theme.borderRadius,
  }),
}));
