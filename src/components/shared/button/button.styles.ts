import { createUseStyles } from "react-jss";
import { Theme } from "../../../styles/theme";

export const useButtonStyles = createUseStyles((theme: Theme) => ({
  buttonBase: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: theme.borderRadius,
    background: theme.palette.primary.main,
    color: theme.palette.white,
  },
  linkButton: {
    textDecoration: "none",
  },
  button: {
    outline: "none",
    border: 0,
    cursor: "pointer",
  },
}));
