import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout/Layout';
import ProjectDetails from './components/ProjectDetails/ProjectDetails';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

library.add(fab, faEnvelope, faArrowLeft);

const App = () => (
  <BrowserRouter>
    <ScrollToTop>
      <div className="App">
        <div className="App-container">
          <Switch>
            <Route
              path="/projects/:projectSlug"
              exact
              component={ProjectDetails}
            />
            <Route
              path="/"
              component={Layout}
            />
          </Switch>
        </div>
      </div>
    </ScrollToTop>
  </BrowserRouter>
);

export default App;
