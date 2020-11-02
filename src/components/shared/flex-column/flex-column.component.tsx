import React from "react";

import {
  FlexColumnStylesProps,
  useFlexColumnStyles,
} from "./flex-column.styles";

interface FlexColumnProps {
  width: string;
}

export const FlexColumn: React.FC<FlexColumnProps> = ({ width, children }) => {
  const flexGridStylesProps: FlexColumnStylesProps = { width };
  const className = useFlexColumnStyles(flexGridStylesProps);

  return <div className={className.flexGrid}>{children}</div>;
};
