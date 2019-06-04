import React, { useState } from 'react';
import ProjectsData from '../../assets/data/projects.json';
import ProjectModal from '../ProjectModal/ProjectModal.js';
import './Projects.css';

const imgsPath = require.context('./../../assets/img');

function Project(props) {

  function handleClick() {
    props.onOpenModal(props.project);
  }

  return (
    <div className="Project" onClick={handleClick}>
      <img src={imgsPath(`./${props.project.image}`)}
        alt={props.project.name}
        className="Project-image"></img>
      <div className="Project-info">
        <h3 className="Project-name">{props.project.name}</h3>
        <p className="Project-summary">Project description</p>
      </div>
    </div>
  );
}

function Projects() {
  const [state, setState] = useState({
    showModal: false,
    selectedProject: null
  });

  function handleOpenModal(project) {
    setState({ showModal: true, project });
  }

  function handleCloseModal() {
    setState({ showModal: false, project: null });
  }

  return (
    <div className="Projects">
      {ProjectsData.map((project, i) => {
        return <Project
          project={project}
          onOpenModal={handleOpenModal}
          key={i} />;
      })}
      <ProjectModal
        showModal={state.showModal}
        project={state.project}
        onCloseModal={handleCloseModal} />
    </div>
  )
}

export default Projects;