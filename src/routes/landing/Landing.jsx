import AboutPreview from "./AboutPreview";
import HeroPreview from "./HeroPreview";
import ContactPreview from "./ContactPreview";
import PgpBlock from "./PgpBlock";
import { Footer } from "../../components";
import ScrollButton from "../../components/ScrollButton";
import { useEffect, React } from "react";
import "./Landing.sass";

const Mainpage = () => {
  useEffect(() => {
    document.title = "Arghya's HomeBase";
    window.scrollTo(0, 0);
  })
  return (
    <main className="landing">
      <HeroPreview />
      <AboutPreview />
      <ContactPreview />
      <PgpBlock />
      <ScrollButton />
      <Footer />
    </main>
  );
};

export default Mainpage;
