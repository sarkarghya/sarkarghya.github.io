import "./Footer.sass";
import { React } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <article className="footer">
      <a
        href="https://github.com/sarkarghya/"
        target="_blank"
        rel="noopener noreferrer">
        Made with ♥ in NYC &copy; {currentYear} Arghya Sarkar
      </a>
    </article>
  );
};

export default Footer;
