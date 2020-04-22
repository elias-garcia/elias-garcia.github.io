import React from 'react';
import TalksData from '../../assets/data/talks.json';
import './Talks.css';

const imgsPath = require.context('./../../assets/img');

const TalkTitle = ({ link, children }) => {
  if (link) {
    return (
      <a
        className="Talk-title-container"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <p className="Talk-title-container">
      {children}
    </p>
  );
};

const Talk = ({ talk }) => (
  <div className="Talk">
    <TalkTitle
      link={talk.link}
    >
      <img
        className="Talk-logo"
        src={imgsPath(`./${talk.image}`)}
        alt={talk.name}
      />
      <h3 className="Talk-title">{talk.title}</h3>
    </TalkTitle>
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
