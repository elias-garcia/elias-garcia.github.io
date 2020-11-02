import React from "react";
import { Link } from "gatsby";
import { Menu } from "react-feather";

import { Container } from "../../shared/container/container.component";
import { useHeaderStyles } from "./header.styles";
import Logo from "../../assets/images/logo.svg";
import { Button } from "../../shared/button/button.component";
import { useTheme } from "react-jss";
import { Theme } from "../../../styles/theme";
import { Route } from "../layout/layout.component";

interface HeaderProps {
  routes: Route[];
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ routes, onOpenMobileMenu }) => {
  const theme = useTheme<Theme>();
  const classes = useHeaderStyles();
  console.log(routes);
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
                component="link"
                to="/the-frontend-lab"
                label="The Frontend Lab"
              />
            </div>
          </nav>
          <button className={classes.mobileMenu} onClick={onOpenMobileMenu}>
            <Menu size={theme.spacing(4)} />
          </button>
        </div>
      </Container>
    </header>
  );
};
