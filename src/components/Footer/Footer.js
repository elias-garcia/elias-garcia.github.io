import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import SocialData from '../../assets/data/social.json';
import Quote from '../Quote/Quote.js';
import './Footer.css';

function getFooterIcons() {
  return SocialData.profiles.map((profile, i) => {
    return (
      <a
        className="Footer-social-icon-link"
        href={profile.link}
        target="_blank"
        rel="noopener noreferrer"
        key={i}>
        <FontAwesomeIcon className="Footer-social-icon" icon={profile.icon} />
      </a>
    );
  })
}

function Footer() {
  return (
    <footer className="Footer">
      <div className="Footer-social-icons">
        {getFooterIcons()}
      </div>
      <Quote />
      <p className="Footer-copyright">© Elías García 2019.</p>
    </footer>
  );
}

export default Footer;