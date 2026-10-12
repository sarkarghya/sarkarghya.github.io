import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import ExternalLink from "../../assets/images/project-external.png";
import { projectsData } from "../../data/projectsData";

const Projects = () => {
  return (
    <motion.section className="projects-grid">
      {projectsData.map((project, index) => (
        <ScrollRevealCard key={project.id} project={project} index={index} />
      ))}
    </motion.section>
  );
};



const ScrollRevealCard = ({ project, index }) => {

  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  // useEffect(() => {
  //   console.log( (mousePosition.x), (mousePosition.y));
  //   console.log(50-Math.sign(50 - mousePosition.x)*Math.abs(50 - mousePosition.x)*2, 50-Math.sign(50 - mousePosition.y)* Math.abs(50 - mousePosition.y)*2);
  //   console.log(Math.abs(50 - mousePosition.x), Math.abs(50 - mousePosition.y));
  // }, [mousePosition])


  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 50, y: 50 }); // Reset to center
  };

  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -200px 0px"
  });

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.645, 0.045, 0.355, 1]
      }
    }
  };

  const zoomEffect = 1.6;

  return (
    <motion.article
      className="project-card"
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="project-content">
        <header className="project-header">
          <motion.h3
            className="project-overline"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Featured Project
          </motion.h3>
          <motion.h3
            className="project-title"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20* ((-1)**((index+1)%2)) }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {project.name}
          </motion.h3>
        </header>
        <p className="project-description">{project.description}</p>
        
        <div className="collaborators">
          <div className="collaborator-list">
          {project.collaborators.map((collaborator, i) => (
            <span key={i} className="collaborator">
              {/* {collaborator.webpage ? ( */}
                <a href={collaborator.webpage} target="_blank" rel="noopener noreferrer">
                  {collaborator.name}
                </a>
              {/* ) : (
                <span>{collaborator.name}</span>
              )} */}
              {i < project.collaborators.length - 1 && " "}
            </span>
          ))}

          </div>
        </div>
        
        <div className="publication">
          <p>{project.publication}</p>
        </div>
        <div className="project-links">
          <a href={project.src} target="_blank" rel="noopener noreferrer">
            <img src={ExternalLink} alt="Visit project" />
          </a>
        </div>
      </div>
      {window.innerWidth > 768 && (
        // <div className="project-image-container">
        <motion.div 
          className="project-image-container"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.img 
            className="project-image"
            src={project.img} 
            alt={project.name} 
            animate={{
              scale: isHovered ? 1.5 : 1,
              transformOrigin: `${50-Math.sign(50 - mousePosition.x)*Math.abs(50 - mousePosition.x)*zoomEffect}% ${50-Math.sign(50 - mousePosition.y)* Math.abs(50 - mousePosition.y)*zoomEffect}%`
            }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut"
            }}
          />
        </motion.div>
      )}
    </motion.article>
  );
};

export default Projects;
