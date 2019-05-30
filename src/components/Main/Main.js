import React from 'react';
import { Route } from 'react-router-dom';
import { leftRoutes, rightRoutes } from '../../routes/routes';
import './Main.css';

function renderRoutes(routes) {
  return routes.map((route, i) => {
    return (
      <Route
        path={route.path}
        exact={route.exact}
        component={route.component}
        key={i} />
    );
  });
}

function Main() {
  return (
    <main className="Main">
      {renderRoutes([...leftRoutes, ...rightRoutes])}
    </main>
  );
}

export default Main;