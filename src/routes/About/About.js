import React from 'react';
import AboutData from '../../assets/data/about.json';
import AboutImage from '../../assets/img/me.jpg';
import './About.css';

const getAboutParagraphs = () => (
  Object.keys(AboutData).map((key, i) => (
    <p key={i}>{AboutData[key]}</p>
  ))
);

const About = () => (
  <div className="About">
    <img className="About-image" src={AboutImage} alt="Me" />
    {getAboutParagraphs()}
  </div>
);

export default About;
