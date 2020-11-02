import React from "react";
import clsx from "clsx";
import { Link } from "gatsby";

import { useButtonStyles } from "./button.styles";

type ButtonProps =
  | {
      component: "button";
      label: string;
      type?: "button" | "submit";
    }
  | {
      component: "link";
      to: string;
      label: string;
    };

export const Button: React.FC<ButtonProps> = props => {
  const classes = useButtonStyles();

  switch (props.component) {
    case "link": {
      return (
        <Link
          className={clsx({
            [classes.buttonBase]: true,
            [classes.linkButton]: true,
          })}
          to={props.to}
          role="button"
        >
          {props.label}
        </Link>
      );
    }
    case "button": {
      return (
        <button
          className={clsx({
            [classes.buttonBase]: true,
            [classes.button]: true,
          })}
          type={props.type || "button"}
        >
          {props.label}
        </button>
      );
    }
  }
};
