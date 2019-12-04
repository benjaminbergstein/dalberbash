import React, { useState } from 'react';
import TextBox from '../TextBox';
import SubmitPrompt from './SubmitPrompt';

const AwaitingPrompt = ({
  game,
  setGame,
  WhenMyTurn,
  WhenNotMyTurn
}) => (
  <>
    <WhenMyTurn>
      <SubmitPrompt game={game} setGame={setGame} />
    </WhenMyTurn>

    <WhenNotMyTurn>
      <TextBox theme='gray' text='Waiting for prompt...' />
    </WhenNotMyTurn>
  </>
);

export default AwaitingPrompt;
