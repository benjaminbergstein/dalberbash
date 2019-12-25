import React, { useState } from 'react';
import CollectionForm from '../CollectionForm';
import TextBox from '../TextBox';
import Button from '../Button';
import withTrackEvent from '../../containers/withTrackEvent';
import { updateRound } from '../../game';

const SubmitPrompt = ({
  game,
  setGame,
  randomPrompt,
  getNewRandomPrompt,
  selectedPrompt,
  setSelectedPrompt,
  trackEvent,
  setWatchGamePaused,
}) => {
  const { round } = game;
  const [prompt, setPrompt] = useState('');
  // setWatchGamePaused(true);
  const handleSubmit = () => {
    trackEvent('Prompt', 'Submit');
    updateRound(game, round, {
      prompt,
      state: 'awaiting_answers',
    });
    // setWatchGamePaused(false);
  };
  const suggestedPromptText = `${randomPrompt[1]} (${randomPrompt[3]})`;
  const useRandomPrompt = () => {
    trackEvent('Prompt', 'Use Suggestion');
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
          <Button theme="yellow" text="I don't like that one..." onClick={getNewRandomPrompt} />
        </>
      )}
    </>
  )
};

export default withTrackEvent(SubmitPrompt);
