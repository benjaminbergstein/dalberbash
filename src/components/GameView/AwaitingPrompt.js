import React, { useState } from 'react';
import TextBox from '../TextBox';
import SubmitPrompt from './SubmitPrompt';

const AwaitingPrompt = ({
  WhenMyTurn,
  WhenNotMyTurn,
  setWatchGamePaused,
  ...props,
}) => (
  <>
    <WhenMyTurn>
      <SubmitPrompt {...props} />
    </WhenMyTurn>

    <WhenNotMyTurn>
      <TextBox theme='gray' text='Waiting for prompt...' />
    </WhenNotMyTurn>
  </>
);

export default AwaitingPrompt;
