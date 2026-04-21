import React, { useEffect, useState, useRef } from "react";
import Button from "./Button";
import ScrollToTop from "../helpers/ScrollToTop";

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);
  const scrollTrackRef = useRef(null);
  const scrollThumbRef = useRef(null);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const maxScroll = scrollHeight - clientHeight;
      
      if (scrolled > 300) {
        setVisible(true);
        if (scrollThumbRef.current && scrollTrackRef.current && maxScroll > 0) {
          const scrollRatio = scrolled / maxScroll;
          const trackHeight = scrollTrackRef.current.clientHeight;
          const thumbHeight = Math.max((clientHeight / scrollHeight) * trackHeight, 30);
          const maxTop = trackHeight - thumbHeight;
          const thumbPosition = Math.min(scrollRatio * maxTop, maxTop);
          
          scrollThumbRef.current.style.height = `${thumbHeight}px`;
          scrollThumbRef.current.style.top = `${thumbPosition}px`;
        }
      } else {
        setVisible(false);
        if (scrollThumbRef.current) {
          scrollThumbRef.current.style.top = '0px';
        }
      }
    };
  
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);
  

  return (
    <div className="scrollbar-container">
      <Button
        className="scroll-btn"
        onClick={ScrollToTop}
        style={{ display: visible ? "inline" : "none" }}
      />
      <div className="scrollbar" ref={scrollTrackRef}>
        <div 
          className="scrollbar__thumb" 
          ref={scrollThumbRef}
        />
      </div>
    </div>
  );
};

export default ScrollButton;
