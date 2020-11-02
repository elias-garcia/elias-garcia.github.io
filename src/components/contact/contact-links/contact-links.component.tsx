import React from "react";
import { Icon, Twitter, GitHub, Linkedin } from "react-feather";
import { useContactListStyles } from "./contact-links.styles";

interface Link {
  Icon: Icon;
  label: string;
  href: string;
}

const contactLinks: Link[] = [
  {
    Icon: Twitter,
    label: "@eliasgarciadev",
    href: "https://www.twitter.com/eliasgarciadev",
  },
  {
    Icon: GitHub,
    label: "elias-garcia",
    href: "https://www.github.com/elias-garcia",
  },
  {
    Icon: Linkedin,
    label: "elias-garcia-marino",
    href: "https://www.linkedin.com/in/elias-garcia-marino",
  },
];

export const ContactLinks: React.FC = () => {
  const classes = useContactListStyles();

  return (
    <ul className={classes.contactLinks}>
      {contactLinks.map((contactLink, index) => (
        <li key={index} className={classes.contactLinkWrapper}>
          <a
            className={classes.contactLink}
            href={contactLink.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <contactLink.Icon className={classes.icon} />
            <span>{contactLink.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
};
