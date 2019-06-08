import React from 'react';
import { Link } from 'react-router-dom';
import ProjectsData from '../../assets/data/projects.json';
import './Projects.css';

const imgsPath = require.context('./../../assets/img');

const Project = ({ project }) => (
  <Link to={`/projects/${project.slug}`} className="Project">
    <img
      src={imgsPath(`./${project.image}`)}
      alt={project.name}
      className="Project-image"
    />
    <div className="Project-info">
      <h3 className="Project-name">{project.name}</h3>
      <p className="Project-summary">{project.summary}</p>
    </div>
  </Link>
);

const Projects = () => (
  <div className="Projects">
    {ProjectsData.map((project, i) => (
      <Project
        project={project}
        key={i}
      />
    ))}
  </div>
);

export default Projects;
