import React, { useState, useEffect } from 'react';
import { setGame, fetchGame } from '../game';
import deepEqual from 'deep-equal';
import { shuffle } from '../utilities';
import promptData from '../promptData.json';

const promptDataWithIndices = promptData.map((item, index) =>  [index, ...item]);
const getRandomPrompt = () => shuffle(promptDataWithIndices)[0];

const withPromptSuggestions = (Component) => {
  return ({ ...props }) => {
    const [selectedPrompt, setSelectedPrompt] = useState(false);

    return <Component
      getRandomPrompt={getRandomPrompt}
      selectedPrompt={selectedPrompt}
      setSelectedPrompt={setSelectedPrompt}
      {...props}
    />
  };
};

export default withPromptSuggestions;
