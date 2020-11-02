import React from "react";

import { SectionStylesProps, useSectionStyles } from "./section.styles";
import { Container } from "../../shared/container/container.component";

interface SectionProps {
  background?: "primary";
}

export const Section: React.FC<SectionProps> = ({ background, children }) => {
  const sectionStylesProps: SectionStylesProps = { background };
  const classes = useSectionStyles(sectionStylesProps);

  return (
    <section className={classes.section}>
      <Container>{children}</Container>
    </section>
  );
};
