import React,  { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';
import CollapsibleText from "./CollapsibleText.jsx";
// import FadeInText from './FadeInText.jsx';

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
      "I am the",
      { 
          trigger: "co-founder of Orvelt,",
          collapse: ["where we are rebuilding trust in the internet."]
      },
      "I am based in",
      {
          trigger: "NYC",
          collapse: ["near Hudson Yards."]
      },
      "At Orvelt, we build",
      {
          trigger: "untraceable verification",
          collapse: [
              "using",
              {
                  trigger: "cryptographic proofs",
                  collapse: [
                      "so people can",
                      {
                          trigger: "verify what is true",
                          collapse: ["without exposing private identity details."]
                      },
                      "This helps build trust while keeping users safe."
                  ]
              }
          ]
      },
      "I am actively working on",
      {
          trigger: "problems",
          collapse: [
              "with a focus on the power concentration effects of",
              {
                  trigger: "GenAI",
                  collapse: ["in socio-political systems."]
              },
              "Doing my part in reducing",
              {
                  trigger: "risks",
                  collapse: ["from inapporiate use of GenAI."]
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
            "taking",
            {
                trigger: "walks",
                collapse: [
                    "by the Hudson",
                ]
            },
            "or email me",
            {
              trigger: "at",
              collapse: [
                  "arghya.sarkar@orvelt.com",
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
