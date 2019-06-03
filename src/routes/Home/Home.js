import React from 'react';
import Cover from '../../components/Cover/Cover';
import Jobs from '../../components/Jobs/Jobs';
import Projects from '../../components/Projects/Projects';
import './Home.css';

function Home() {
  return (
    <div className="Home">
      <Cover />
      <div className="Home-jobs">
        <h1 className="Home-jobs-title">Jobs</h1>
        <Jobs />
      </div>
      <div className="Home-projects">
        <h1 className="Home-projects-title">Projects</h1>
        <Projects />
      </div>
    </div>
  );
}

export default Home;