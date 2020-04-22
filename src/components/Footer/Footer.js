import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import SocialData from '../../assets/data/social.json';
import Quote from '../Quote/Quote';
import './Footer.css';

const getFooterIcons = () => SocialData.map((profile, i) => (
  <a
    className="Footer-social-icon-link"
    href={profile.link}
    target="_blank"
    rel="noopener noreferrer"
    key={i}
  >
    <FontAwesomeIcon className="Footer-social-icon" icon={profile.icon} />
  </a>
));

const Footer = () => (
  <footer className="Footer">
    <div className="Footer-social-icons">
      {getFooterIcons()}
    </div>
    <Quote />
    <p className="Footer-copyright">© Elías García 2020.</p>
  </footer>
);

export default Footer;
