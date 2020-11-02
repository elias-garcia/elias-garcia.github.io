import { createUseStyles } from "react-jss";

import { Theme } from "../../../styles/theme";

export const useContactFormStyles = createUseStyles((theme: Theme) => ({
  contactForm: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(3),
  },
  label: {
    display: "block",
    marginBottom: theme.spacing(1),
  },
  input: {
    outline: "none",
    color: theme.palette.black,
    padding: theme.spacing(2),
    borderRadius: theme.borderRadius,
    background: theme.palette.white,
    border: `2px solid ${theme.palette.white}`,
    "&:focus": {
      borderColor: theme.palette.primary.main,
    },
    "&::placeholder": {
      color: theme.palette.gray,
    },
    textArea: {
      resize: "vertical",
    },
  },
}));
