import React from 'react';
import './Cover.css';

const Cover = () => (
  <div className="Cover">
    <h1 className="Cover-welcome">
      Hello
      {' '}
      <span role="img" aria-label="welcome">👋</span>
    </h1>
    <h1 className="Cover-title">
      My name is Elias García
    </h1>
    <h2 className="Cover-subtitle">
      I&apos;m an A Coruña based software engineer focused
      on develop and deliver clean and quality code
    </h2>
  </div>
);

export default Cover;
