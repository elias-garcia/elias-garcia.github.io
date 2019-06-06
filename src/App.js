import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

library.add(fab, faEnvelope);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <div className="App">
          <div className="App-container">
            <Header />
            <Main />
            <Footer />
          </div>
        </div>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
