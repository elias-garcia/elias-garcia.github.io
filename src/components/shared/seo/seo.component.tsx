import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
}

export const SEO: React.FC<SEOProps> = ({ title }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `
  );

  return (
    <Helmet
      htmlAttributes={{
        lang: "es",
      }}
      defaultTitle={site.siteMetadata.title}
      title={title}
      titleTemplate={`${site.siteMetadata.title} | %s`}
    />
  );
};
