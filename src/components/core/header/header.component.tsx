import React from "react";
import { Link } from "gatsby";

import { Container } from "../../shared/container/container.component";
import { useHeaderStyles } from "./header.styles";
import Logo from "../../assets/images/logo.svg";
import { Button } from "../../shared/button/button.component";

interface Route {
  label: string;
  to: string;
}

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
];

export const Header: React.FC = () => {
  const classes = useHeaderStyles();

  return (
    <header className={classes.header}>
      <Container>
        <div className={classes.content}>
          <h1 className={classes.logoWrapper}>
            <Link className={classes.logoLink} to="/">
              <Logo className={classes.logo} />
            </Link>
          </h1>
          <nav className={classes.nav}>
            <ul className={classes.linkList}>
              {routes.map((route, index) => (
                <li key={index} className={classes.linkWrapper}>
                  <Link
                    className={classes.link}
                    to={route.to}
                    activeClassName={classes.activeLink}
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className={classes.ctaButton}>
              <Button
                type="link"
                to="/the-frontend-lab"
                label="The Frontend Lab"
              />
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
};
