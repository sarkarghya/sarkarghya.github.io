import "./About.sass";
import { useEffect, React } from "react";
import { Footer } from "../../components/index.jsx";
import AboutWrap from "./AboutWrap.jsx";
import ScrollButton from "../../components/ScrollButton";

const About = () => {
  useEffect(() => {
    document.title = "About | Arghya Sarkar";
    window.scrollTo(0, 0);
  })
  return (
    <main className="about">
      <AboutWrap />
      <ScrollButton />
      <Footer />
    </main>
  );
};

export default About;
