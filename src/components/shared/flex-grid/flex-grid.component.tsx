import React from "react";

import { FlexGridStylesProps, useFlexGridStyles } from "./flex-grid.styles";

interface FlexGridProps {
  direction: "row" | "column";
}

export const FlexGrid: React.FC<FlexGridProps> = ({ direction, children }) => {
  const flexGridStylesProps: FlexGridStylesProps = { direction };
  const className = useFlexGridStyles(flexGridStylesProps);

  return <div className={className.flexGrid}>{children}</div>;
};
