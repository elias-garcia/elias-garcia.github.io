import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import ProjectsData from '../../assets/data/projects.json';
import Tags from '../Tags/Tags';
import './ProjectDetails.css';

const ProjectDetails = withRouter(({ history, match }) => {
  const imgsPath = require.context('./../../assets/img');
  const project = ProjectsData.filter((projectData) => (
    projectData.slug === match.params.projectSlug
  ))[0];

  if (!project) {
    return <Redirect to="/" />;
  }

  function handleClick() {
    history.push('/');
  }

  return (
    <div className="ProjectDetails">
      <div className="ProjectDetails-cover">
        <div
          className="ProjectDetails-image"
          style={{
            backgroundImage: [
              `url(${imgsPath(`./${project.image}`)})`,
            ],
          }}
          alt={project.name}
        />
        <div className="ProjectDetails-image-overlay">
          <h1 className="ProjectDetails-title">{project.name}</h1>
          <h2 className="ProjectDetails-subtitle">{project.year}</h2>
        </div>
        <button
          className="ProjectDetails-back-button"
          onClick={handleClick}
          type="button"
        >
          <FontAwesomeIcon
            className="ProjectDetails-back-button-icon"
            icon={['fas', 'arrow-left']}
          />
        </button>
      </div>
      <div className="ProjectDetails-content">
        <h2 className="ProjectDetails-description-header">Description</h2>
        <div className="ProjectDetails-description">
          <p className="ProjectDetails-description-text">{project.info}</p>
          <p className="ProjectDetails-description-text">{project.description}</p>
          {project.components && (
            <ul className="ProjectDetails-components">
              {project.components.map((component, i) => (
                <li
                  className="Project-Details-component-name"
                  key={i}
                >
                  <b>
                    {component.name}
                    :
                    {' '}
                  </b>
                  <span className="Project-Details-component-details">
                    {component.details}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="ProjectDetails-tags">
          <h2 className="ProjectDetails-tags-header">Techs used</h2>
          <Tags tags={project.techs} />
        </div>
      </div>
    </div>
  );
});

export default ProjectDetails;
