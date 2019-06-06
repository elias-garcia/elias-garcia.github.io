import React from 'react';
import { Link } from 'react-router-dom';
import ProjectsData from '../../assets/data/projects.json';
import './Projects.css';
const imgsPath = require.context('./../../assets/img');

function Project(props) {
  return (
    <Link to={`/projects/${props.project.slug}`} className="Project">
      <img src={imgsPath(`./${props.project.image}`)}
        alt={props.project.name}
        className="Project-image"></img>
      <div className="Project-info">
        <h3 className="Project-name">{props.project.name}</h3>
        <p className="Project-summary">Project description</p>
      </div>
    </Link>
  );
}

function Projects() {
  return (
    <div className="Projects">
      {ProjectsData.map((project, i) => {
        return <Project
          project={project}
          key={i} />;
      })}
    </div>
  )
}

export default Projects;
