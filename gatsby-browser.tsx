import React from "react";
import "normalize.css";
import { ThemeProvider } from "react-jss";

import { theme } from "./src/styles/theme";
import { Layout } from "./src/components/core/layout/layout.component";

export const wrapPageElement = ({ element, props }) => {
  return (
    <ThemeProvider theme={theme}>
      <Layout {...props}>{element}</Layout>
    </ThemeProvider>
  );
};
