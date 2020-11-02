import { createUseStyles } from "react-jss";
import { Theme } from "../../../styles/theme";

export interface FlexGridStylesProps {
  direction: "row" | "column";
}

export const useFlexGridStyles = createUseStyles((theme: Theme) => ({
  flexGrid: ({ direction }: FlexGridStylesProps) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    direction,
    [theme.breakpoints.upMd]: {
      flexDirection: "row",
    },
  }),
}));
