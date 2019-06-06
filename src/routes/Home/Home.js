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
        <h2 className="Home-jobs-title">Jobs</h2>
        <Jobs />
      </div>
      <div className="Home-projects">
        <h2 className="Home-projects-title">Projects</h2>
        <Projects />
      </div>
    </div>
  );
}

export default Home;