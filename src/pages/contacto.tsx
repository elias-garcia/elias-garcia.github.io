import React from "react";

import { MainSection } from "../components/contact/main-section/main-section.component";
import { SEO } from "../components/shared/seo/seo.component";

const Contact: React.FC = () => {
  return (
    <>
      <SEO title="Contacto" />
      <MainSection />
    </>
  );
};

export default Contact;
