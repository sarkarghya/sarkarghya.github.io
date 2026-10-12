import { NavLink } from "react-router-dom";
import { React, useEffect, useState } from 'react';
import ScrollToTop from "../../helpers/ScrollToTop";

const NavigationLogo = (props) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = (e) => {
    if (isAnimating) {
      e.preventDefault(); // Prevent navigation if animating
      return;
    }

    setIsAnimating(true);
    ScrollToTop();
    props.closeMenu();

    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
  };

  return (
    <NavLink
      to="/"
      className="navigation__logo"
      onClick={handleClick}
    >
      <div className="logo-text">
        <span className={`logo-top ${isAnimating ? 'animate' : ''}`} data-text="ARGHYA">ARGHYA</span>
        <span className={`logo-bottom ${isAnimating ? 'animate' : ''}`} data-text="SARKAR">SARKAR</span>
      </div>
    </NavLink>
  );
};

export default NavigationLogo;
