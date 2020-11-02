import React from "react";

import { useMainSectionStyles } from "./main-section.styles";
import { ContactForm } from "../../contact/contact-form/contact-form.component";
import { Container } from "../../shared/container/container.component";
import { Card } from "../../shared/card/card.component";
import { DisplayHeading } from "../../shared/display-heading/display-heading.component";
import { FlexColumn } from "../../shared/flex-column/flex-column.component";
import { FlexGrid } from "../../shared/flex-grid/flex-grid.component";
import { ContactLinks } from "../../contact/contact-links/contact-links.component";

export const MainSection: React.FC = () => {
  const classes = useMainSectionStyles();

  return (
    <Container>
      <div className={classes.content}>
        <DisplayHeading>Contacto</DisplayHeading>
        <FlexGrid direction="row">
          <FlexColumn width="45%">
            <p className={classes.text}>
              No dudes en contactarme si tienes alguna duda sobre The Frontend
              Lab, sobre algún artículo del blog o simplemente si te gustaría
              hablar conmigo sobre cualquier otro tema.
            </p>
            <div className={classes.contactLinksWrapper}>
              <ContactLinks />
            </div>
          </FlexColumn>
          <FlexColumn width="45%">
            <Card background="primary">
              <ContactForm />
            </Card>
          </FlexColumn>
        </FlexGrid>
      </div>
    </Container>
  );
};
