import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { leftRoutes, rightRoutes } from '../../routes/routes';
import ProjectDetails from '../ProjectDetails/ProjectDetails';
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
      <Switch>
        {renderRoutes([...leftRoutes, ...rightRoutes])}
        <Route
          path="/projects/:projectSlug"
          exact={true}
          component={ProjectDetails} />
        <Redirect from="*" to="/" />
      </Switch>
    </main>
  );
}

export default Main;