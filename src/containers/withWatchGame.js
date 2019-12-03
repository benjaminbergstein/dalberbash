import React, { useEffect } from 'react';
import { setGame, fetchGame } from '../game';
import deepEqual from 'deep-equal';

const withWatchGame = (Component) => {
  return ({ game, setGame, ...props }) => {
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
          if (hasChanged) setGame(localUpdatedGame);
        });
      }, 1000);

      return () => clearInterval(interval);
    });

    return <Component
      game={game}
      setGame={setGame}
      {...props}
    />
  };
};

export default withWatchGame;
