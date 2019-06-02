import React from 'react';
import Cover from '../../components/Cover/Cover';
import Jobs from '../../components/Jobs/Jobs';
import './Home.css';

function Home() {
  return (
    <div className="Home">
      <Cover />
      <div className="Home-jobs">
        <h1 className="Home-jobs-title">Past jobs</h1>
        <Jobs></Jobs>
      </div>
      <div className="Home-projects">
        <h1 className="Home-projects-title">Side projects</h1>
      </div>
    </div>
  );
}

export default Home;