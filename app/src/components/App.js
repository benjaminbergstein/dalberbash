import React, { useState } from 'react';
import StartView from './StartView/StartView';
import PreGameView from './PreGameView';
import GameView from './GameView/GameView';
import { useLazyQuery } from '@apollo/react-hooks';
import { FETCH_GAME } from '../graphql/queries';
import withTrackEvent from '../containers/withTrackEvent';

const COMPONENT_MAP = {
  not_joined: StartView,
  waiting: PreGameView,
  playing: GameView,
};

const App = ({ initialGameId, initialCurrentPlayer, trackEvent }) => {
  const [gameId, setGameId] = useState(initialGameId);
  const [currentPlayer, setCurrentPlayer] = useState(initialCurrentPlayer)
  console.log(`gameId: ${gameId}`);
  console.log(`currentPlayer: ${currentPlayer}`);

  const onGameCreated = ({ gameId, currentPlayer }) => {
    console.log(gameId);
    setGameId(gameId);
    setCurrentPlayer(currentPlayer);
    window.location.hash = `${gameId}.1`;
    trackEvent('Game', 'Create');
  };

  const [loadGame, { called, loading, error, data }] = useLazyQuery(FETCH_GAME, {
    variables: {
      gameId: initialGameId,
    },
  });

  if (!called && gameId) loadGame();
  if (called && loading) return null;
  console.log(data, error, loading)

  console.log(data);
  const { game } = called ? data : { game: { state: 'not_joined' } };

  const Component = COMPONENT_MAP[game.state];

  return <Component game={game} onGameCreated={onGameCreated} />;
};

export default withTrackEvent(App);
