import React, { useState, useEffect } from 'react';
import { setGame, fetchGame } from '../game';
import deepEqual from 'deep-equal';

const withWatchGame = (Component) => {
  return ({ game, setGame, ...props }) => {
    const [isWatchGamePaused, setWatchGamePaused] = useState(false);
    const {
      currentPlayer,
      players,
      name,
    } = game;

    useEffect(() => {
      const {
        currentPlayer,
        players,
        name,
      } = game;

      const interval = setInterval(() => {
        fetchGame(name).then((updatedGame) => {
          const localUpdatedGame = { ...updatedGame, currentPlayer };
          const hasChanged = !deepEqual(game, localUpdatedGame);
          if (hasChanged && !isWatchGamePaused) setGame(localUpdatedGame);
        });
      }, 1000);

      return () => clearInterval(interval);
    });

    return <Component
      game={game}
      setGame={setGame}
      setWatchGamePaused={setWatchGamePaused}
      {...props}
    />
  };
};

export default withWatchGame;
