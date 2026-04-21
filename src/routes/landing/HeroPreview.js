import React,  { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import CollapsibleText from "./CollapsibleText.js";
// import FadeInText from './FadeInText.js';

import img from "../../assets/images/goodpic.jpg";

const HeroPreview = () => {
  const [showSecondPara, setShowSecondPara] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondPara(true);
    }, 18*150);

    return () => clearTimeout(timer);
  }, []);

  const firstpara = {
    text: [
        "I am based out of" ,
        { 
            trigger: "NYC",
            collapse: ["near Fidi Area"]
        },
        "where I am a" ,
        {
            trigger: "college senior",
            collapse: [
                "at",
                {
                    trigger: "New York University",
                    collapse: [
                        "where I study",
                        {
                            trigger: "Computer Science,",
                            collapse: ["with specializations in cybersecurity and computer engineering,"]
                        },
                        "and Mathematics."
                    ]
                }
            ]
        },
        "I work on my own" ,
        {
            trigger: "problems",
            collapse: [
                "trying to understand the largescale effects of",
                {
                    trigger: "GenAI",
                    collapse: ["on our future generation"]
                },
                "including trying to reduce",
                {
                    trigger: "risks",
                    collapse: ["form unaligned AI"]
                }
            ]
        }
    ]
};

const secondpara = {
  text: [
      "Feel free to" ,
      { 
          trigger: "catch me",
          collapse: [
            "grabbing",
            {
                trigger: "bagels",
                collapse: [
                    "around Washington Square Park",
                ]
            },
            "or email me",
            {
              trigger: "at",
              collapse: [
                  "arghya@nyu.edu",
              ]
          },
        ]
      }
  ]
};

  
  return (
    <article className="landing__hero">
      <div className="hero-content">
        <h1 className="hero-font white-text">
          Hi, I am <em className="pink-text">
            <TypeAnimation
              sequence={[
                'Arghya',
                2000,
                'অর্ঘ্য',
                2000,
                'अर्घ्य',
                2000,
                '奥锐',
                2000,
              ]}
              wrapper="span"
              speed={50}
              style={{ 
                display: 'inline-block',
                minWidth: '120px'
              }}
              repeat={Infinity}
            />
          </em>
          <br />
        </h1>

        <p>
          <CollapsibleText {...firstpara} />
        </p>
        {showSecondPara && (
          <p>
            <CollapsibleText {...secondpara} />
          </p>
        )}
      </div>
      <div className="hero-image">
        <img src={img} alt="Arghya" />
      </div>
      
    </article>
  );
};


export default HeroPreview;
