import React from "react";
import { X } from "react-feather";
import { useTheme } from "react-jss";
import { Link } from "gatsby";

import { useMobileMenuStyles } from "./mobile-menu.styles";
import { Theme } from "../../../styles/theme";
import { Route } from "../layout/layout.component";

interface MobileMenuProps {
  routes: Route[];
  isOpen: boolean;
  onClose: () => void;
}

const CLOSE_KEY = "Escape";

export const MobileMenu: React.FC<MobileMenuProps> = ({
  routes,
  isOpen,
  onClose,
}) => {
  const theme = useTheme<Theme>();
  const classes = useMobileMenuStyles();
  const sidebarRef = React.useRef<HTMLDivElement>();

  function handleBackgroundKeyDown(event: React.KeyboardEvent) {
    if (event.key === CLOSE_KEY) {
      onClose();
    }
  }

  React.useEffect(() => {
    if (isOpen && sidebarRef !== null) {
      sidebarRef.current.focus();
    }
  }, [isOpen]);

  return (
    isOpen && (
      <>
        <div className={classes.background} onClick={onClose} />
        <div
          tabIndex={0}
          className={classes.sidebar}
          ref={sidebarRef}
          onKeyDown={handleBackgroundKeyDown}
        >
          <div className={classes.sidebarHeader}>
            <h2 className={classes.title}>Menú</h2>
            <button className={classes.closeButton} onClick={onClose}>
              <X size={theme.spacing(4)} />
            </button>
          </div>
          <ul className={classes.linkList}>
            {routes.map((route, index) => (
              <li key={index} className={classes.linkWrapper}>
                <Link
                  to={route.to}
                  className={classes.link}
                  activeClassName={classes.activeLink}
                  onClick={onClose}
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  );
};
