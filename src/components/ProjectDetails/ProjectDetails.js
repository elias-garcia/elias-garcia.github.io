import React from 'react';
import { Redirect } from 'react-router-dom';
import ProjectsData from '../../assets/data/projects.json';
import Tags from '../Tags/Tags';
import './ProjectDetails.css';

function ProjectDetails({ match }) {
  const imgsPath = require.context('./../../assets/img');
  const project = ProjectsData.filter((project) => {
    return project.slug === match.params.projectSlug
  })[0];

  if (!project) {
    return <Redirect to="/" />;
  }

  return (
    <div className="ProjectDetails">
      <div className="ProjectDetails-cover">
        <div
          style={{
            backgroundImage: [
              `url(${imgsPath(`./${project.image}`)})`
            ]
          }}
          alt={project.name}
          className="ProjectDetails-image">
        </div>
        <div className="ProjectDetails-image-overlay">
          <h1 className="ProjectDetails-title">{project.name}</h1>
          <h2 className="ProjectDetails-subtitle">{project.year}</h2>
        </div>
      </div>
      <div className="ProjectDetails-content">
        <h2 className="ProjectDetails-description-header">Description</h2>
        <div className="ProjectDetails-description">
          <p className="ProjectDetails-description-text">{project.info}</p>
          <p className="ProjectDetails-description-text">{project.description}</p>
          {project.components && <ul className="ProjectDetails-components">
            {project.components.map((component, i) => {
              return <li
                className="Project-Details-component-name"
                key={i}>
                {component.name}:&nbsp;
                <span className="Project-Details-component-details">
                  {component.details}
                </span>
              </li>
            })}
          </ul>}
        </div>
        <div className="ProjectDetails-tags">
          <h2 className="ProjectDetails-tags-header">Techs used</h2>
          <Tags tags={project.techs} />
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;