import Linkedin from "../../assets/images/socials/linkedin-pink.svg";
import Github from "../../assets/images/socials/github-pink.svg";
import Email from "../../assets/images/socials/email-pink.svg";
import { React } from 'react';

const NavigationSocials = () => {
  return (
    <section className="navigation__socials">
      <a
        href="https://www.linkedin.com/in/sarkarghya/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={Linkedin} alt="LinkedIn profile" />
      </a>
      <a
        href="https://github.com/sarkarghya"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={Github} alt="GitHub" />
      </a>
      <a
        href="mailto:arghya@nyu.edu"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={Email} alt="Email" />
      </a>
    </section>
  );
};

export default NavigationSocials;
