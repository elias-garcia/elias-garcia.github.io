import React from "react";

import { Header } from "../header/header.component";
import { Main } from "../main/main.component";
import { MobileMenu } from "../mobile-menu/mobile-menu.component";
import { useLayoutStyles } from "./layout.styles";

export interface Route {
  label: string;
  to: string;
}

export const Layout: React.FC = ({ children }) => {
  const classes = useLayoutStyles();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const routes: Route[] = [
    {
      label: "Inicio",
      to: "/",
    },
    {
      label: "Sobre mí",
      to: "/sobre-mi",
    },
    {
      label: "Blog",
      to: "/blog",
    },
    {
      label: "Contacto",
      to: "/contacto",
    },
  ];

  function handleMobileMenuToggle() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  return (
    <div className={classes.layout}>
      <Header onOpenMobileMenu={handleMobileMenuToggle} routes={routes} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuToggle}
        routes={routes}
      />
      <Main>{children}</Main>
    </div>
  );
};
