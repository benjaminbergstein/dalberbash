import React, { useState } from 'react';
import TextBox from '../TextBox';
import SubmitPrompt from './SubmitPrompt';

const AwaitingPrompt = ({
  game,
  getRandomPrompt,
  selectedPrompt,
  setSelectedPrompt,
  WhenMyTurn,
  WhenNotMyTurn,
}) => (
  <>
    <WhenMyTurn>
      <SubmitPrompt
        game={game}
        getRandomPrompt={getRandomPrompt}
        setSelectedPrompt={setSelectedPrompt}
        selectedPrompt={selectedPrompt}
      />
    </WhenMyTurn>

    <WhenNotMyTurn>
      <TextBox theme='gray' text='Waiting for prompt...' />
    </WhenNotMyTurn>
  </>
);

export default AwaitingPrompt;
