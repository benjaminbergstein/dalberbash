import React from 'react';
import {
  watchGame,
  startGame,
} from './game';

const WaitingScreen = ({ game, setGame }) => {
  const {
    currentPlayer,
    players,
    name,
  } = game;

  const handleClick = () => {
    startGame(name)
  };
  watchGame(game, setGame);

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

export default WaitingScreen;
