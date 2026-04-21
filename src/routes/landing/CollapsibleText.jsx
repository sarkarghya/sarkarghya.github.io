import React, { useState, useEffect, useRef } from 'react';
  
const CollapsibleText = (inputJson) => {
//   const complicatedNestedList = [
//     ['I am based out of'],
//     ['NYC', [['near Fidi Area']]],
//     ['where I am a'],
//     ['college senior', [['at'], ['New York University', [['where I study'], ['Computer Science,', [['with specializations in cybersecurity and computer engineering,']]], ['and Mathematics.']] ]]],
//     ['I work on my own'],
//     ['problems', [['trying to understand the largescale effects of'], ['GenAI', [['on our future generation']]], ['including trying to reduce'], ['risks', [['form unaligned AI']] ] ]]
//     ];

    const initjson = {
        text: [
            "I am the" ,
            { 
                trigger: "co-founder of Orvelt,",
                collapse: ["a platform focused on internet trust"]
            },
            "based out of" ,
            {
                trigger: "NYC",
                collapse: ["near Hudson Yards"]
            },
            "At Orvelt, we build" ,
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
                            "Engendering trust while keeping users safe."
                        ]
                    }
                ]
            },
            "I am carefully studying" ,
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

  const [displayList, setDisplayList] = useState([]);
  const [clickedKeys, setClickedKeys] = useState(new Set());
  const [index, setIndex] = useState(0);
  const [allTopLevelKeysLoaded, setAllTopLevelKeysLoaded] = useState(false);
  const intervalRef = useRef(null);
  const [processedList, setProcessedList] = useState([]);

  const [positions, setPositions] = useState({});
  const spanRefs = useRef({});

  const animatedItems = useRef(new Set())
  const isInitialLoading = useRef(true);
  const [isClickInProgress, setIsClickInProgress] = useState(false);

  const convertToNestedList = (collapsibleText) => {
    const convertNode = (node) => {
      if (typeof node === 'string') {
        return [node];
      } else {
        return [node.trigger, convertChildren(node.collapse)];
      }
    };
    const convertChildren = (items) => {
      return items.map((child) => convertNode(child));
    };
    return collapsibleText.text.map((item) => convertNode(item));
  };
  
  const preprocessNestedList = (arr, prefix = '') => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item.length === 1) {
        const [key] = item;
        if (key.includes(' ')) {
          result.push(...key.split(' ').map((k, index) => 
            [`${k}-${prefix}${i}-${index}`]
          ));
        } else {
          result.push([`${key}-${prefix}${i}`]);
        }
      } else {
        const [key, value] = item;
        if (Array.isArray(value)) {
          result.push([`${key}-${prefix}${i}`, 
            preprocessNestedList(value, `${prefix}${i}-`)]);
        } else if (typeof key === 'string' && key.includes(' ')) {
          result.push(...key.split(' ').map((k, index) => 
            [`${k}-${prefix}${i}-${index}`]));
        } else {
          result.push([`${key}-${prefix}${i}`, value]);
        }
      }
    }
    return result;
  }
  
  

  const isPressable = (value, key) => {
    if (!allTopLevelKeysLoaded && key.split('&').length > 1) {
      return false;
    }
    return Array.isArray(value) && value.length > 0 && typeof value[0] !== 'string';
  };

  const getNestedListValue = (path) => {
    if (!path) return undefined;
    try {
      return path.split('&').reduce((list, key) => {
        if (Array.isArray(list)) {
          const found = list.find(item => item[0] === key);
          return found ? found[1] : undefined;
        }
        return undefined;
      }, processedList);
    } catch (error) {
      return undefined;
    }
  };

  const findNextParentIndex = (currentIndex, currentDepth) => {
    for (let i = currentIndex + 1; i < displayList.length; i++) {
      const depth = displayList[i].split('&').length;
      if (depth === currentDepth) {
        return i;
      }
    }
    return displayList.length;
  };

  const handleClick = (key, clickIndex) => {

    if (isInitialLoading.current || isClickInProgress) return;

    // console.log('Clicked index:', clickIndex);
    // console.log('Clicked key:', key);
    
    const value = getNestedListValue(key);
    if (!isPressable(value) || clickedKeys.has(key)) return;
    
    setIsClickInProgress(true);
    setClickedKeys(prev => new Set(prev).add(key));
  
    const nextKeys = value.map(item => `${key}&${item[0]}`);
  
    const currentDepth = key.split('&').length;
    const insertIndex = findNextParentIndex(clickIndex, currentDepth);
    let currentIndex = clickIndex;
    
    // console.log('Next keys to be inserted:', nextKeys);
    // console.log('Current insertion index:', currentIndex);
    
    const addNextKey = () => {
        if (nextKeys.length > 0) {
          const nextKey = nextKeys.shift();
          setDisplayList(prevList => {
            const updatedList = [
              ...prevList.slice(0, currentIndex),
              nextKey,
              ...prevList.slice(currentIndex)
            ];
            return updatedList;
          });
          currentIndex++;
          setTimeout(addNextKey, 125);
        } else {
          setIsClickInProgress(false);
        }
      };
    
      addNextKey();
  };
  
  useEffect(() => {
    // console.log('AAAAA', complicatedNestedList);
    // console.log('BBBBB',  convertToNestedList(initjson));
    // const topLevelKeys = complicatedNestedList.map(item => item[0]);
    
    const processed = preprocessNestedList(convertToNestedList(inputJson));
    setProcessedList(processed);
    const topLevelKeys = processed.map(item => item[0]);

    intervalRef.current = setInterval(() => {
      if (index < topLevelKeys.length) {
        setDisplayList(prevList => {
          const updatedList = [...prevList, topLevelKeys[index]];
        //   console.log('Initial loading, current list:', updatedList);
          return updatedList;
        });
        setIndex(prevIndex => prevIndex + 1);
      } else {
        clearInterval(intervalRef.current);
        setAllTopLevelKeysLoaded(true);
        isInitialLoading.current = false;
      }
    }, 125);
  
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [index]);

//   useEffect(() => {
//     // Store positions of existing elements
//     displayList.forEach((item, index) => {
//       if (spanRefs.current[index]) {
//         const rect = spanRefs.current[index].getBoundingClientRect();
//         setPositions(prev => ({
//           ...prev,
//           [index]: { left: rect.left, top: rect.top }
//         }));
//       }
//     });
//   }, [displayList]);


  const getDisplayName = (item) => {
    return item?.split('&').pop().replace(/-\d+-\d+|-\d+/g, '') || item;
  };

  

  return (
    <div className="display-list" >
      {displayList.map((item, i) => {
        const value = getNestedListValue(item);
        const isPressableItem = isPressable(value, item) && !clickedKeys.has(item);

        const shouldAnimate = isInitialLoading.current || !animatedItems.current.has(item);
        if (shouldAnimate) {
          animatedItems.current.add(item);
        }

        return (
            <span 
            key={`${item}-${i}`} // Combine item with index for uniqueness
            ref={el => spanRefs.current[i] = el}
            onClick={() => isPressableItem && !isClickInProgress && handleClick(item, i)}
            className={`
                ${isPressableItem ? 'pressable' : 'non-pressable'}
                ${shouldAnimate ? 'fade-in' : ''}
                ${clickedKeys.has(item) ? 'clicked' : ''}
              `}
            onAnimationEnd={(e) => {
                if (e.animationName === 'fadeIn') {
                  e.target.classList.remove('fade-in');
                }
            }}
          >
            {getDisplayName(item)}
          </span>
        );
      })}
    </div>
  );
};

export default CollapsibleText;