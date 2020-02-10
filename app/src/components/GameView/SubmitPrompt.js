import React, { useState, useEffect } from 'react';
import CollectionForm from '../CollectionForm';
import TextBox from '../TextBox';
import Button from '../Button';
import withTrackEvent from '../../containers/withTrackEvent';
import { useMutation } from '@apollo/react-hooks';
import { SUBMIT_PROMPT } from '../../graphql/queries';

const SubmitPrompt = ({
  gameId,
  getRandomPrompt,
  selectedPrompt,
  setSelectedPrompt,
  trackEvent,
}) => {
  const [prompt, setPrompt] = useState(selectedPrompt[1] || '');
  const [submitPrompt, { called }] = useMutation(SUBMIT_PROMPT, {
    variables: { gameId, prompt },
    onComplete: () => trackEvent('Prompt', 'Submit'),
  });
  const [randomPrompt, setRandomPrompt] = useState(getRandomPrompt());
  const newRandomPrompt = () => {
    setRandomPrompt(getRandomPrompt());
  }
  const suggestedPromptText = `${randomPrompt[1]} (${randomPrompt[3]})`;
  const useRandomPrompt = () => {
    trackEvent('Prompt', 'Use Suggestion');
    setSelectedPrompt(randomPrompt);
  };

  useEffect(() => {
    if (selectedPrompt && !called) submitPrompt();
  }, [selectedPrompt]);

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
            handleSubmit={submitPrompt}
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

export default withTrackEvent(SubmitPrompt);
