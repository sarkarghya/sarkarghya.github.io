import { NavLink } from "react-router-dom";
import React, { useState, useCallback } from 'react';
import ScrollToTop from "../../helpers/ScrollToTop";

const foreignLetters = '人性कद喜स的টশहण能一मমর痛ণনভ重ज是性情同शनतप二生部বস惊自类দচভ人苦可রতপখকজवयখধ由活分的性';

const useGlitchEffect = (originalText, glitchDuration = 200, returnDuration = 800) => {
  const [text, setText] = useState(originalText);
  const [isGlitching, setIsGlitching] = useState(false);

  const startGlitching = useCallback(() => {
    setIsGlitching(true);
    let glitchedIndices = new Set();
    let index = 0;

    const glitchInterval = setInterval(() => {
      setText(prevText => 
        prevText.split('').map((char, i) => {
          if (i === index) {
            return foreignLetters[Math.floor(Math.random() * foreignLetters.length)];
          }
          if (!glitchedIndices.has(i)) {
            glitchedIndices.add(i);
            return foreignLetters[Math.floor(Math.random() * foreignLetters.length)];
          }
          return char;
        }).join('')
      );
      index = (index + 1) % originalText.length;
    }, 5);

    setTimeout(() => {
      clearInterval(glitchInterval);
      
      let originalIndices = new Set([...Array(originalText.length).keys()]);
      
      const returnInterval = setInterval(() => {
        if (originalIndices.size === 0) {
          clearInterval(returnInterval);
          setIsGlitching(false);
          return;
        }

        setText(prevText => {
          const textArray = prevText.split('');
          const indexToRestore = Array.from(originalIndices)[Math.floor(Math.random() * originalIndices.size)];
          textArray[indexToRestore] = originalText[indexToRestore];
          originalIndices.delete(indexToRestore);
          return textArray.join('');
        });
      }, returnDuration / originalText.length);
    }, glitchDuration);

  }, [originalText, glitchDuration, returnDuration]);

  return [text, isGlitching, startGlitching];
};


const NavigationLink = ({ to, children, ...props }) => {
  const [glitchedText, isGlitching, startGlitching] = useGlitchEffect(children);

  return (
    <NavLink
      to={to}
      {...props}
      onMouseEnter={startGlitching}
    >
      {[...(isGlitching ? glitchedText : children)].map((letter, index) => (
        <span key={index} className="glitch-letter">{letter}</span>
      ))}
    </NavLink>
  );
};

const NavigationLinks = (props) => {
  const activeNavLink = ({ isActive }) =>
    "gray-text navigation__link" + (isActive ? " active" : "");

  return (
    <section className="navigation__links">
      <NavigationLink
        to="/"
        className={({ isActive }) =>
          "gray-text navigation__link" + (isActive ? " main-active" : "")
        }
        onClick={() => {
          ScrollToTop();
          props.closeMenu();
        }}
      >
        Home
      </NavigationLink>

      <NavigationLink
        to="/about"
        onClick={() => {
          ScrollToTop();
          props.closeMenu();
        }}
        className={activeNavLink}
      >
        About
      </NavigationLink>

      <NavigationLink
        to="/portfolio"
        className={activeNavLink}
        onClick={() => {
          ScrollToTop();
          props.closeMenu();
        }}
      >
        Projects
      </NavigationLink>
    </section>
  );
};

export default NavigationLinks;
