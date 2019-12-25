import React, { useState, useEffect } from 'react';
import { setGame } from '../game';
import deepEqual from 'deep-equal';
import { shuffle } from '../utilities';
import promptData from '../data/data';

const promptDataWithIndices = promptData.map((item, index) =>  [index, ...item]);
const getRandomPrompt = () => shuffle(promptDataWithIndices)[0];

const withPromptSuggestions = (Component) => {
  const initialRandomPrompt = getRandomPrompt();
  return ({ ...props }) => {
    const [selectedPrompt, setSelectedPrompt] = useState(false);
    const [randomPrompt, setRandomPrompt] = useState(initialRandomPrompt);
    const resetSelectedPrompt = () => setSelectedPrompt(false);
    const getNewRandomPrompt = () => setRandomPrompt(getRandomPrompt());

    return <Component
      getNewRandomPrompt={getNewRandomPrompt}
      randomPrompt={randomPrompt}
      selectedPrompt={selectedPrompt}
      setSelectedPrompt={setSelectedPrompt}
      resetSelectedPrompt={resetSelectedPrompt}
      {...props}
    />
  };
};

export default withPromptSuggestions;
