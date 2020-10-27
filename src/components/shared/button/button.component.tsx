import clsx from "clsx";
import { Link } from "gatsby";

import React from "react";
import { useButtonStyles } from "./button.styles";

type ButtonProps =
  | {
      type: "button";
      label: string;
    }
  | {
      type: "link";
      to: string;
      label: string;
    };

export const Button: React.FC<ButtonProps> = props => {
  const classes = useButtonStyles();

  switch (props.type) {
    case "link": {
      return (
        <Link
          className={clsx({
            [classes.buttonBase]: true,
            [classes.linkButton]: true,
          })}
          to={props.to}
        >
          {props.label}
        </Link>
      );
    }
    default: {
      return (
        <button
          className={clsx({
            [classes.buttonBase]: true,
            [classes.button]: true,
          })}
        >
          {props.label}
        </button>
      );
    }
  }
};
