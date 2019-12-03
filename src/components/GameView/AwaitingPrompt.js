import React, { useState } from 'react';
import SubmitPrompt from './SubmitPrompt';

const AwaitingPrompt = ({
  game,
  setGame,
  WhenMyTurn,
  WhenNotMyTurn
}) => {
  const { turnPlayer } = game;
  return (
    <>
      <WhenMyTurn>
        <SubmitPrompt game={game} setGame={setGame} />
      </WhenMyTurn>

      <WhenNotMyTurn>
        <div>It's player {turnPlayer}'s turn</div>
      </WhenNotMyTurn>
    </>
  );
};

export default AwaitingPrompt;
