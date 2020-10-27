import React from "react";

import { Header } from "../header/header.component";
import { Main } from "../main/main.component";
import { useLayoutStyles } from "./layout.styles";

export const Layout: React.FC = ({ children }) => {
  const classes = useLayoutStyles();

  return (
    <div className={classes.layout}>
      <Header />
      <Main>{children}</Main>
    </div>
  );
};
