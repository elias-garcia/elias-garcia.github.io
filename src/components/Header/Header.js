import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/img/logo.svg';
import { leftRoutes, rightRoutes } from '../../routes/routes';
import './Header.css';

const renderTabs = tabsData => tabsData.map((tabData, i) => (
  <NavLink
    to={tabData.path}
    className="Header-tab"
    activeClassName="Header-tab--active"
    exact={tabData.exact}
    key={i}
  >
    {tabData.label}
  </NavLink>
));

const Header = () => (
  <header className="Header">
    <div className="Header-tabs-left">
      {renderTabs(leftRoutes)}
    </div>
    <Link to="/" className="Header-logo-container">
      <img src={logo} alt="logo" className="Header-logo" />
    </Link>
    <div className="Header-tabs-right">
      {renderTabs(rightRoutes)}
    </div>
  </header>
);

export default Header;
