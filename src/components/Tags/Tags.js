import React from 'react';
import './Tags.css';

function Tag(props) {
  return (
    <p className="Tag">#{props.text}</p>
  );
}

function Tags(props) {
  return (
    <div className="Tags">
      {props.tags.map((tech, i) => <Tag text={tech} key={i} />)}
    </div>
  );
}

export default Tags;