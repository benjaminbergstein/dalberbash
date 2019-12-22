import React, { useState } from 'react';
import CollectionForm from '../CollectionForm';
import { updateRound } from '../../game';

const SubmitPrompt = ({ game, setGame }) => {
  const [prompt, setPrompt] = useState('');
  const { round } = game;
  const handleSubmit = () => {
    updateRound(game, round, {
      prompt,
      state: 'awaiting_answers',
    });
  };

  return (
    <CollectionForm
      prompt="What's the prompt?"
      handleSubmit={handleSubmit}
      field={prompt}
      setField={setPrompt}
    />
  )
};

export default SubmitPrompt;
