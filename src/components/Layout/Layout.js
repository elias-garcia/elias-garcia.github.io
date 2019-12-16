import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { leftRoutes, rightRoutes } from '../../routes/routes';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import './Layout.css';

const renderRoutes = (routes) => routes.map((route, i) => (
  <Route
    path={`${route.path}`}
    exact={route.exact}
    component={route.component}
    key={i}
  />
));

const Layout = () => (
  <main className="Layout">
    <Header />
    <div className="Layout-content">
      <Switch>
        {renderRoutes([...leftRoutes, ...rightRoutes])}
        <Redirect from="*" to="/" />
      </Switch>
    </div>
    <Footer />
  </main>
);

export default Layout;
