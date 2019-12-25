import React, { useState } from 'react';
import CollectionForm from '../CollectionForm';
import TextBox from '../TextBox';
import Button from '../Button';
import { updateRound } from '../../game';

const SubmitPrompt = ({
  game,
  setGame,
  getRandomPrompt,
  selectedPrompt,
  setSelectedPrompt,
}) => {
  const [prompt, setPrompt] = useState(selectedPrompt[1] || '');
  const { round } = game;
  const handleSubmit = () => {
    updateRound(game, round, {
      prompt,
      state: 'awaiting_answers',
    });
  };
  const [randomPrompt, setRandomPrompt] = useState(getRandomPrompt());
  const newRandomPrompt = () => {
    setRandomPrompt(getRandomPrompt());
  }
  const suggestedPromptText = `${randomPrompt[1]} (${randomPrompt[3]})`;
  const useRandomPrompt = () => {
    updateRound(game, round, {
      prompt: suggestedPromptText,
      state: 'awaiting_answers',
    });
    setSelectedPrompt(randomPrompt);
  };

  return (
    <>
      {selectedPrompt && (
        <TextBox
          theme='blue'
          text={`Submitting Prompt "${suggestedPromptText}"...`}
          marginTop='0.5em'
        />
      )}

      {!selectedPrompt && (
        <>
          <CollectionForm
            prompt="What's the prompt?"
            handleSubmit={handleSubmit}
            field={prompt}
            setField={setPrompt}
          />

          <TextBox
            theme='blue'
            text={`Suggested Prompt: ${suggestedPromptText}`}
            marginTop='0.5em'
          />
          <TextBox theme='gray' text={randomPrompt[2]} />
          <Button theme="green" text={`Use: ${randomPrompt[1]}`} onClick={useRandomPrompt} />
          <Button theme="yellow" text="I don't like that one..." onClick={newRandomPrompt} />
        </>
      )}
    </>
  )
};

export default SubmitPrompt;
