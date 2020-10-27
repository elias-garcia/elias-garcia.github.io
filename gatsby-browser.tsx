import React from "react";
import "normalize.css";
import { ThemeProvider } from "react-jss";

import { theme } from "./src/styles/theme";
import { Layout } from "./src/components/core/layout/layout.component";

type WrapPageElementFn = (params: {
  element: React.ReactNode;
  props: Record<string, unknown>;
}) => React.ReactNode;

export const wrapPageElement: WrapPageElementFn = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};

type WrapRootElementFn = (params: {
  element: React.ReactNode;
}) => React.ReactNode;

export const wrapRootElement: WrapRootElementFn = ({ element }) => {
  return <ThemeProvider theme={theme}>{element}</ThemeProvider>;
};
