import React from "react";

import { CardStylesProps, useCardStyles } from "./card.styles";

interface CardProps {
  background?: "primary";
}

export const Card: React.FC<CardProps> = ({ background, children }) => {
  const cardStylesProps: CardStylesProps = { background };
  const classes = useCardStyles(cardStylesProps);

  return <div className={classes.card}>{children}</div>;
};
