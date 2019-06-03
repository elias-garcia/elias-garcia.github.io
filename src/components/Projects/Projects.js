import React from 'react';
import ProjectsData from '../../assets/data/projects.json';
import './Projects.css';

const imgsPath = require.context('./../../assets/img');

function getProjects() {
  return ProjectsData.map((project, i) => {
    return (
      <div className="Project"
        key={i}>
        <img src={imgsPath(`./${project.image}`)}
          alt={project.name}
          className="Project-image"></img>
        <div className="Project-info">
          <h3 className="Project-name">{project.name}</h3>
          <p className="Project-summary">Project description</p>
        </div>
      </div>
    );
  });
}

function Projects() {
  return (
    <div className="Projects">
      {getProjects()}
    </div>
  )
}

export default Projects;