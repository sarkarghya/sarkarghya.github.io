// AboutMe.jsx
import { React } from 'react';
import SimpleScene from './SimpleScene';
import AboutMe from './AboutMe';

const AboutWrap = () => {
  return (
    <article className='landing__about'>
        <AboutMe />
        <SimpleScene />
    </article>
  );
};

export default AboutWrap;