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

const App = ({ initialGameId, initialCurrentPlayer, trackEvent }) => {
  const [gameId, setGameId] = useState(initialGameId);
  const [currentPlayer, setCurrentPlayer] = useState(initialCurrentPlayer)

  const onGameJoined = ({ isCreator, gameId, player }) => {
    setGameId(gameId);
    setCurrentPlayer(player);
    window.location.hash = `${gameId}.${player}`;
    trackEvent('Game', isCreator ? 'Create' : 'Join');
  };

  if (gameId) {
    return <Game gameId={gameId} currentPlayer={currentPlayer} />;
  } else {
    return <StartView onGameJoined={onGameJoined} />;
  }
};

export default withTrackEvent(App);
