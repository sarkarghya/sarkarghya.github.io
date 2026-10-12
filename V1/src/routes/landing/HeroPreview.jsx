import React,  { useState, useEffect, useMemo } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { prepare, layout, prepareWithSegments, measureLineStats } from '@chenglou/pretext';
import CollapsibleText from "./CollapsibleText.jsx";
// import FadeInText from './FadeInText.jsx';
import img from "../../assets/images/goodpic.jpg";

const greetingSequence = ['Hi', 'নমস্কার', 'नमस्ते', '你好'];
const nameSequence = ['Arghya', 'অর্ঘ্য', 'अर्घ्य', '奥锐'];
const HEADING_FONT = '700 56px Inter';
const HEADING_MAX_WIDTH = 361;
const HEADING_LINE_HEIGHT = 88;

const HeroPreview = () => {
  const [showSecondPara, setShowSecondPara] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? HEADING_MAX_WIDTH : window.innerWidth
  );
  const headingWrapWidth = useMemo(() => {
    const horizontalPadding = viewportWidth >= 576 ? 96 : 48;
    return Math.min(HEADING_MAX_WIDTH, Math.max(220, viewportWidth - horizontalPadding));
  }, [viewportWidth]);
  const headingMinHeight = useMemo(() => {
    const heights = greetingSequence.map((greeting) => {
      const prepared = prepare(`${greeting}, I am`, HEADING_FONT);
      const { height } = layout(prepared, headingWrapWidth, HEADING_LINE_HEIGHT);
      return height;
    });
    return Math.max(...heights);
  }, [headingWrapWidth]);
  const nameMinWidth = useMemo(() => {
    const maxWidth = Math.max(...nameSequence.map((name) => {
      const prepared = prepareWithSegments(name, HEADING_FONT);
      return measureLineStats(prepared, 2000).maxLineWidth;
    }));
    return Math.ceil(maxWidth);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSecondPara(true);
    }, 18*150);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % greetingSequence.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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
        <h1
          className="hero-font white-text"
          style={{
            minHeight: `${headingMinHeight}px`,
            maxWidth: `${headingWrapWidth}px`,
            whiteSpace: 'normal',
            fontSize: '56px',
            lineHeight: 1.1
          }}
        >
          {greetingSequence[greetingIndex]}, I am <em className="pink-text">
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
                minWidth: `${nameMinWidth}px`,
                transform: 'scale(1.2)',
                transformOrigin: 'left center'
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
