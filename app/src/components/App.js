import React, { useState } from 'react';
import StartView from './StartView/StartView';
import PreGameView from './PreGameView';
import GameView from './GameView/GameView';
import { useLazyQuery, useSubscription } from '@apollo/react-hooks';
import { FETCH_GAME, WATCH_GAME } from '../graphql/queries';
import withTrackEvent from '../containers/withTrackEvent';

const withGameUpdates = (Component) => ({ gameId, game, ...props }) => {
  const { data, loading } = useSubscription(WATCH_GAME, {
    variables: { gameId },
  });

  return <Component
    game={(data || {}).gameUpdated || game}
    gameLoading={loading}
    {...props}
  />;
};

const COMPONENT_MAP = {
  not_joined: StartView,
  waiting: withGameUpdates(PreGameView),
  playing: withGameUpdates(GameView),
};

const App = ({ initialGameId, initialCurrentPlayer, trackEvent }) => {
  const [gameId, setGameId] = useState(initialGameId);
  const [currentPlayer, setCurrentPlayer] = useState(initialCurrentPlayer)

  const onGameCreated = ({ gameId, currentPlayer }) => {
    setGameId(gameId);
    setCurrentPlayer(currentPlayer);
    window.location.hash = `${gameId}.1`;
    trackEvent('Game', 'Create');
  };

  const [loadGame, { called, loading, error, data }] = useLazyQuery(FETCH_GAME, {
    variables: {
      gameId,
    },
  });

  if (!called && gameId) loadGame();
  if (called && loading) return null;

  const { game } = called && data ? data : { game: { state: 'not_joined' } };

  const Component = COMPONENT_MAP[game.state];

  return <Component
    gameId={gameId}
    currentPlayer={currentPlayer}
    game={game}
    onGameCreated={onGameCreated}
  />;
};

export default withTrackEvent(App);
