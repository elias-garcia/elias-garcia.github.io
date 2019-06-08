import React from 'react';
import TalksData from '../../assets/data/talks.json';
import './Talks.css';

const imgsPath = require.context('./../../assets/img');

const Talk = ({ talk }) => (
  <div className="Talk">
    <a
      className="Talk-title-container"
      href={talk.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="Talk-logo"
        src={imgsPath(`./${talk.image}`)}
        alt={talk.name}
      />
      <h3 className="Talk-title">{talk.title}</h3>
    </a>
    <p className="Talk-place">
      @
      {talk.place}
    </p>
    <p className="Talk-date">
      {talk.date}
      {' '}
      -
      {' '}
      {talk.hour}
    </p>
  </div>
);

const Talks = () => (
  <div className="Talks">
    {TalksData.map((talk, i) => <Talk talk={talk} key={i} />)}
  </div>
);

export default Talks;
