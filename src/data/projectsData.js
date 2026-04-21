import Canvas from "../assets/images/portfolio/Canvas.png";
import MDP1 from "../assets/images/portfolio/MDP1.png";
import Notebook from "../assets/images/portfolio/Notebook.png";

const projectsData = [
  {
    id: "kiwi-notebook",
    img: Notebook,
    name: "KiwiNotebook",
    stack: ["< RESTful API />", "< CSS3 />", "< React.js />"],
    src: "https://github.com/HumanNotebookInteractions/HumanNotebookInteractions.github.io/raw/main/Papers/CHI_2024_Workshop_Paper_KiwiNotebook%20-%20Mohamed%20Hendy.pdf",
    source: "https://github.com/HumanNotebookInteractions/HumanNotebookInteractions.github.io/raw/main/Papers/CHI_2024_Workshop_Paper_KiwiNotebook%20-%20Mohamed%20Hendy.pdf",
    collaborators: [ 
      {name: "Mohamed Hendy*", webpage: "https://www.linkedin.com/in/mhendy25/"},
      {name: "Arghya Sarkar*", webpage: ""},
      {name: "Utku Ege Tuluk", webpage: "https://uetuluk.com/en/"},
      {name: "Yicheng Jiang", webpage: "https://whongyi.github.io/MAPS-research"},
      {name: "Xin Teng", webpage: "https://whongyi.github.io/MAPS-research"},
      {name: "Hongyi Wen, PhD", webpage: "https://whongyi.github.io/"},
    ],
    publication: "1st ACM CHI Workshop on Human-Notebook Interactions, CHI Workshop, 2024",
    description:
      "Interactive Computational Notebook Enhanced by Retrieval-Augmented Language Models",
  },
  {
    id: "eff-rescue",
    img: MDP1,
    name: "Reconnaissance",
    stack: ["< HTML5 />", "< CSS />", "< Vanilla JS />", "< RESTful API />"],
    src: "https://www.purdue.edu/undergrad-research/conferences/summer/2023Keys/Symp%20Key%20by%20Division%20-%20Science.pdf",
    source: "https://www.purdue.edu/undergrad-research/conferences/summer/2023Keys/Symp%20Key%20by%20Division%20-%20Science.pdf",
    collaborators: [ 
      {name: "Arghya Sarkar", webpage: ""},
      {name: "Madeleine M Yuh", webpage: "https://dl.acm.org/profile/99660838089"},
      {name: "Neera Jain, PhD", webpage: "https://engineering.purdue.edu/ME/People/ptProfile?resource_id=119137"},
    ],
    publication: "Summer Undergraduate Research Fellowship Sypmosium Proceedings (2023)",
    description:
      "Markov Decision Process Approach to Calibrate Human-Automation Teaming in Search and Rescue",
  },
  {
    id: "lmcanvas",
    img: Canvas,
    name: "LMCanvas",
    stack: ["< Vanilla JS />", "< CSS3 />", "< HTML5 />"],
    src: "https://arxiv.org/abs/2303.15125",
    source: "https://arxiv.org/abs/2303.15125",
    collaborators: [ 
      {name: "Tae Soo Kim", webpage: "https://taesookim.com/"},
      {name: "Arghya Sarkar", webpage: ""},
      {name: "Yoonjoo Lee", webpage: "https://yoonjoolee.com/"},
      {name: "Minsuk Chang", webpage: "https://minsukchang.com/"},
      {name: "Juho Kim, PhD", webpage: "https://juhokim.com/"},
    ],
    publication: "Generative AI and HCI, CHI Workshop, 2023",
    description:
      "Object-Oriented Interaction to Personalize Large Language Model-Powered Writing Environments",
  }
];

export { projectsData };
