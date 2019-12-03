import React, { useState } from 'react';
import CollectionForm from './CollectionForm';
import {
  updateGame,
} from '../../game';

const SubmitPrompt = ({ game, setGame }) => {
  const [prompt, setPrompt] = useState('');
  const { round } = game;
  const handleSubmit = () => {
    const updatedGame = {
      ...game,
      round: {
        ...round,
        prompt,
        state: 'awaiting_answers',
      },
    };
    updateGame(updatedGame);
  };

  return (
    <div>
      <div>It's your turn</div>
      <CollectionForm
        prompt="What's the prompt?"
        handleSubmit={handleSubmit}
        field={prompt}
        setField={setPrompt}
      />
    </div>
  )
};

export default SubmitPrompt;
