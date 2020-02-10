import React, { useState } from 'react';
import TextBox from '../TextBox';
import SubmitPrompt from './SubmitPrompt';
import turnHelper from './turnHelper';
import useGame from '../../hooks/useGame';

const AwaitingPrompt = ({
  gameId,
  currentPlayer,
  getRandomPrompt,
  selectedPrompt,
  setSelectedPrompt,
}) => {
  const { game, subscribe } = useGame(gameId);
  subscribe();
  const { WhenMyTurn, WhenNotMyTurn } = turnHelper(currentPlayer, game);

  return <>
    <WhenMyTurn>
      <SubmitPrompt
        gameId={gameId}
        getRandomPrompt={getRandomPrompt}
        setSelectedPrompt={setSelectedPrompt}
        selectedPrompt={selectedPrompt}
      />
    </WhenMyTurn>

    <WhenNotMyTurn>
      <TextBox theme='gray' text='Waiting for prompt...' />
    </WhenNotMyTurn>
  </>
};

export default AwaitingPrompt;
