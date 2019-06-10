import React from 'react';
import Cover from '../../components/Cover/Cover';
import Jobs from '../../components/Jobs/Jobs';
import Projects from '../../components/Projects/Projects';
import Talks from '../../components/Talks/Talks';
import './Home.css';

const Home = () => (
  <div className="Home">
    <div className="Home-cover">
      <Cover />
    </div>
    <div className="Home-jobs">
      <h2 className="Home-jobs-title">Work experience</h2>
      <Jobs />
    </div>
    <div className="Home-talks">
      <h2 className="Home-talks-title">Tech talks</h2>
      <Talks />
    </div>
    <div className="Home-projects">
      <h2 className="Home-projects-title">Side projects</h2>
      <Projects />
    </div>
  </div>
);

export default Home;
