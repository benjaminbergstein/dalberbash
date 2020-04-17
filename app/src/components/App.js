import React, { useState } from 'react';
import StartView from './StartView/StartView';
import PreGameView from './PreGameView';
import GameView from './GameView/GameView';
import withTrackEvent from '../containers/withTrackEvent';
import useGame from '../hooks/useGame';

const COMPONENT_MAP = {
  waiting: PreGameView,
  playing: GameView,
};

const Game = ({ gameId, ...props }) => {
  const { game, loading, subscribe } = useGame(gameId);
  subscribe();
  console.log("Update: ", game);

  if (loading) return null;

  const { state } = game;
  const GameComponent = COMPONENT_MAP[state];
  return <GameComponent gameId={gameId} {...props} />
};

const App = ({ initialGameId, shouldJoin, initialCurrentPlayer, trackEvent }) => {
  const [gameId, setGameId] = useState(initialGameId);
  const [currentPlayer, setCurrentPlayer] = useState(initialCurrentPlayer)
  const [hasJoined, setHasJoined] = useState(false)

  const onGameJoined = ({ isCreator, gameId, player }) => {
    setGameId(gameId);
    setCurrentPlayer(player);
    setHasJoined(true)
    window.location.hash = `${gameId}.${player}`;
    trackEvent('Game', isCreator ? 'Create' : 'Join');
  };

  if (gameId && !(shouldJoin && hasJoined === false)) {
    return <Game gameId={gameId} currentPlayer={currentPlayer} />;
  } else {
    return <StartView gameId={gameId} onGameJoined={onGameJoined} />;
  }
};

export default withTrackEvent(App);
