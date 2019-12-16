import React from 'react';
import GroupsDataData from '../../assets/data/groups.json';
import './Groups.css';

const imgsPath = require.context('./../../assets/img');

const Group = ({ group }) => (
  <div className="Group">
    <a
      className="Group-title-container"
      href={group.website}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="Group-logo"
        src={imgsPath(`./${group.logo}`)}
        alt={group.name}
      />
      <h3 className="Group-title">{group.name}</h3>
    </a>
    <h3>{group.role}</h3>
    <p className="Group-dates">
      {group.startDate}
      {' '}
      -
      {' '}
      {group.endingDate}
    </p>
    <p className="Group-description">{group.description}</p>
  </div>
);

const Groups = () => (
  <div className="Groups">
    {GroupsDataData.map((group, i) => <Group group={group} key={i} />)}
  </div>
);

export default Groups;
