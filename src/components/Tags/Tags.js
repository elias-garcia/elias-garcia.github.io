import React from 'react';
import './Tags.css';

const Tag = ({ text }) => (
  <p className="Tag">
    #
    {text}
  </p>
);

const Tags = ({ tags }) => (
  <div className="Tags">
    {tags.map((tech, i) => <Tag text={tech} key={i} />)}
  </div>
);

export default Tags;
