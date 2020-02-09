import React, { useState } from 'react';
import StartView from './StartView/StartView';
import PreGameView from './PreGameView';
import GameView from './GameView/GameView';
import { useLazyQuery, useSubscription } from '@apollo/react-hooks';
import { FETCH_GAME, WATCH_GAME } from '../graphql/queries';
import withTrackEvent from '../containers/withTrackEvent';

const COMPONENT_MAP = {
  waiting: PreGameView,
  playing: GameView,
};

const Game = ({ gameId, game: fetchedGame, ...props }) => {
  const { data, loading } = useSubscription(WATCH_GAME, {
    variables: { gameId },
  });

  const game = data ? data.gameUpdated : fetchedGame;
  const { state } = game;

  const GameComponent = COMPONENT_MAP[state];
  return <GameComponent
    game={game}
    gameLoading={loading}
    {...props}
  />;
};

const App = ({ initialGameId, initialCurrentPlayer, trackEvent }) => {
  const [gameId, setGameId] = useState(initialGameId);
  const [currentPlayer, setCurrentPlayer] = useState(initialCurrentPlayer)

  const onGameJoined = ({ isCreator, gameId, player }) => {
    setGameId(gameId);
    setCurrentPlayer(player);
    window.location.hash = `${gameId}.${player}`;
    trackEvent('Game', isCreator ? 'Create' : 'Join');
  };

  const [loadGame, { called, loading, error, data }] = useLazyQuery(FETCH_GAME, {
    variables: {
      gameId,
    },
  });

  if (!called && gameId) loadGame();
  if (called && loading) return null;

  if (called && data) {
    const { game } = data;

    return <Game
      gameId={gameId}
      game={game}
      currentPlayer={currentPlayer}
    />;
  } else {
    return <StartView onGameJoined={onGameJoined} />;
  }
};

export default withTrackEvent(App);
