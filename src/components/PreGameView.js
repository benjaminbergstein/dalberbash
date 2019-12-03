import React from 'react';
import withWatchGame from '../containers/withWatchGame';
import { startGame } from '../game';

const PreGameView = ({ game }) => {
  const {
    currentPlayer,
    players,
    name,
  } = game;

  const handleClick = () => startGame(name);

  return (
    <div>
      <h1>Game {name}</h1>
      <p>Waiting for players to join</p>
      <p>{players} player(s) currently joined</p>
      {currentPlayer === 1 && (
        <button onClick={handleClick}>Start!</button>
      )}
    </div>
  )
};

export default withWatchGame(PreGameView);
