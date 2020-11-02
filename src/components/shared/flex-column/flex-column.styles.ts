import { createUseStyles } from "react-jss";

export interface FlexColumnStylesProps {
  width: string;
}

export const useFlexColumnStyles = createUseStyles({
  flexGrid: ({ width }: FlexColumnStylesProps) => ({
    flex: `0 1 ${width}`,
  }),
});
