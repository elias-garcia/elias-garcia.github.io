import React from "react";

import { Header } from "../header/header.component";
import { useLayoutStyles } from "./layout.styles";

export const Layout: React.FC = () => {
  useLayoutStyles();

  return (<div>
      <Header />
    </div>);
};
