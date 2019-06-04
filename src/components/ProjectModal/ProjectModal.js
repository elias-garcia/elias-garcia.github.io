import React from 'react';
import Modal from 'react-modal';
import './ProjectModal.css';

Modal.setAppElement('#root');

function ProjectModal(props) {
  if (!props.project) {
    return null;
  }

  function handleRequestClose() {
    props.onCloseModal();
  }

  function handleClick() {
    props.onCloseModal();
  }

  return (
    <Modal
      isOpen={props.showModal}
      onRequestClose={handleRequestClose}>
      <p>{props.project.name}</p>
      <button onClick={handleClick}>Close</button>
    </Modal>
  );
}

export default ProjectModal;

