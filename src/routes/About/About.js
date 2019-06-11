import React from 'react';
import './About.css';
import AboutData from '../../assets/data/about.json';

const getAboutParagraphs = () => {
return Object.keys(AboutData).map((key, i) => {
  return <p key={i}>{AboutData[key]}</p>;
})
}

const About = () => (
  <div className="About">
    {getAboutParagraphs()}
  </div>
);

export default About;
