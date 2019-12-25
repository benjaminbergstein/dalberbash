import React, { useState, useEffect } from 'react';
import deepEqual from 'deep-equal';
import { getWebSocket, resetWebSocket } from '../game.js';

const withWatchGame = (Component) => {
  return ({
    game,
    setGame,
    ...props
  }) => {
    const [isWatchGamePaused, setWatchGamePaused] = useState(false);
    const [readyState, setReadyState] = useState(0);
    const {
      currentPlayer,
      players,
      name,
    } = game;

    useEffect(() => {
      const ws = getWebSocket(name);
      const onMessage = (event) => {
        const updatedGame = JSON.parse(event.data);
        const localUpdatedGame = { ...updatedGame, currentPlayer };
        const hasChanged = !deepEqual(game, localUpdatedGame);
        if (hasChanged && !isWatchGamePaused) setGame(localUpdatedGame)
      };

      const pollInterval = setInterval(() => {
        if (ws.readyState === 1) {
          ws.send();
        }
        if (ws.readyState === 3) {
          resetWebSocket(name);
          setReadyState(0);
        };
      }, 15000);

      const updateReadyState = () => {
        setReadyState(ws.readyState);
      };

      ws.addEventListener('message', onMessage);

      ws.addEventListener('open', () => {
        ws.send('');
        updateReadyState();
      });
      ws.addEventListener('close', updateReadyState);
      ws.addEventListener('error', updateReadyState);
      updateReadyState();

      return () => {
        ws.removeEventListener('message', onMessage);
        ws.removeEventListener('open', updateReadyState);
        ws.removeEventListener('close', updateReadyState);
        ws.removeEventListener('error', updateReadyState);
        clearInterval(pollInterval);
      }
    }, [readyState]);

    return <Component
      game={game}
      setGame={setGame}
      setWatchGamePaused={setWatchGamePaused}
      connected={readyState === 1}
      {...props}
    />
  };
};

export default withWatchGame;
